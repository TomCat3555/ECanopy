import { useState, useEffect, useRef } from 'react';
import { visitorService } from '../services/visitorService';
import { societyService } from '../services/societyService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { notify } from '../utils/alerts';
import { Camera, X, Check } from 'lucide-react';

export default function AddVisitorForm({ societyId, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [flats, setFlats] = useState([]);

    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        category: 'GUEST',
        purpose: '',
        flatId: '',
        imageUrl: '',
        vehicleNumber: '',
        idProofType: '',
        idProofNumber: '',
        expectedDurationMinutes: 60 // Default 1 hour
    });

    // Load buildings
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const data = await societyService.getBuildings(societyId);
                setBuildings(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (societyId) fetchBuildings();
    }, [societyId]);

    // Load Flats
    useEffect(() => {
        if (!selectedBuilding) {
            setFlats([]);
            return;
        }
        const fetchFlats = async () => {
            try {
                const data = await societyService.getFlats(selectedBuilding);
                setFlats(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFlats();
    }, [selectedBuilding]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await visitorService.checkIn({
                ...formData,
                flatId: Number(formData.flatId),
                expectedDurationMinutes: formData.expectedDurationMinutes ? Number(formData.expectedDurationMinutes) : null
            });

            notify.success(`Visitor checked in successfully! Status: ${response.status}`);
            if (response.status === 'PENDING') {
                onSuccess(response.logId, 'PENDING');
            } else {
                onSuccess(response.logId, 'APPROVED');
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to check in visitor';
            notify.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    const startCamera = async () => {
        try {
            setIsCameraOpen(true);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            notify.error("Could not access camera. Please check permissions.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, 320, 240);

            canvasRef.current.toBlob(async (blob) => {
                const file = new File([blob], "visitor_photo.jpg", { type: "image/jpeg" });
                try {
                    setLoading(true);
                    const data = await visitorService.uploadImage(file);
                    setFormData(prev => ({ ...prev, imageUrl: data.url }));
                    notify.success("Photo captured!");
                    stopCamera();
                } catch (err) {
                    console.error("Upload failed", err);
                    notify.error("Failed to upload photo");
                } finally {
                    setLoading(false);
                }
            }, 'image/jpeg');
        }
    };

    // Clean up stream on unmount
    useEffect(() => {
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [stream]);

    return (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 mb-10 fade-up">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                <div className="p-3 bg-indigo-600 rounded-2xl mr-4">
                    <Camera className="w-5 h-5 text-white" />
                </div>
                Digital Check-In
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                        label="Visitor Legal Name *"
                        placeholder="e.g. John Doe"
                        className="rounded-2xl"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Phone Number *"
                        placeholder="10-digit mobile"
                        className="rounded-2xl"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        pattern="[0-9]{10}"
                        title="Phone must be 10 digits"
                        required
                    />
                </div>

                {/* Building and Flat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Destination Building *</label>
                        <select
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all appearance-none border"
                            value={selectedBuilding}
                            onChange={e => { setSelectedBuilding(e.target.value); setFormData({ ...formData, flatId: '' }); }}
                            required
                        >
                            <option value="">-- Choose Building --</option>
                            {buildings.map(b => (
                                <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Destination Flat *</label>
                        <select
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all appearance-none border"
                            value={formData.flatId}
                            onChange={e => setFormData({ ...formData, flatId: e.target.value })}
                            disabled={!selectedBuilding}
                            required
                        >
                            <option value="">-- Choose Flat --</option>
                            {flats.map(f => (
                                <option key={f.flatId} value={f.flatId}>{f.flatNumber}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Category and Purpose */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Visitor Category *</label>
                        <select
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all appearance-none border"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="GUEST">Guest</option>
                            <option value="DELIVERY">Delivery</option>
                            <option value="CAB">Cab</option>
                            <option value="MAID">Maid</option>
                            <option value="VENDOR">Vendor</option>
                            <option value="SERVICE">Service</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nature of Visit</label>
                        <Input
                            placeholder="e.g. Meeting, Repair"
                            className="rounded-2xl"
                            value={formData.purpose}
                            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                        />
                    </div>
                </div>

                {/* Vehicle and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                        label="Vehicle Registration (Optional)"
                        placeholder="e.g. MH01AB1234"
                        className="rounded-2xl"
                        value={formData.vehicleNumber}
                        onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    />
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Expected Stay</label>
                        <select
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all appearance-none border"
                            value={formData.expectedDurationMinutes}
                            onChange={e => setFormData({ ...formData, expectedDurationMinutes: e.target.value })}
                        >
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                            <option value="180">3 hours</option>
                            <option value="240">4 hours</option>
                            <option value="480">8 hours</option>
                        </select>
                    </div>
                </div>

                {/* ID Proof */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Verification Identity</label>
                        <select
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all appearance-none border"
                            value={formData.idProofType}
                            onChange={e => setFormData({ ...formData, idProofType: e.target.value })}
                        >
                            <option value="">-- No ID Selected --</option>
                            <option value="AADHAAR">Aadhaar Card</option>
                            <option value="PAN">PAN Card</option>
                            <option value="DL">Driving License</option>
                            <option value="PASSPORT">Passport</option>
                        </select>
                    </div>
                    <Input
                        label="Identity Reference No."
                        placeholder="Enter ID number"
                        className="rounded-2xl"
                        value={formData.idProofNumber}
                        onChange={e => setFormData({ ...formData, idProofNumber: e.target.value })}
                        disabled={!formData.idProofType}
                    />
                </div>

                {/* Camera / Photo Section */}
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Security Surveillance Capture *</label>
                    <div className="flex flex-col items-center">
                        {isCameraOpen ? (
                            <div className="space-y-6 flex flex-col items-center">
                                <div className="relative bg-slate-950 rounded-[2rem] overflow-hidden border-4 border-indigo-600/20 shadow-2xl" style={{ width: 320, height: 240 }}>
                                    <video ref={videoRef} autoPlay playsInline width={320} height={240} className="object-cover" />
                                    <div className="absolute inset-0 border-2 border-white/10 pointer-events-none"></div>
                                </div>
                                <div className="flex space-x-4">
                                    <Button type="button" onClick={capturePhoto} className="px-8 bg-indigo-600">Capture Bio-ID</Button>
                                    <Button type="button" variant="ghost" onClick={stopCamera} className="text-slate-500 font-bold">Dismiss</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-6">
                                {formData.imageUrl ? (
                                    <div className="relative">
                                        <div className="w-40 h-40 rounded-[2rem] overflow-hidden border-4 border-emerald-500/20 shadow-xl group">
                                            <img src={`http://localhost:8080${formData.imageUrl}`} alt="Visitor" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Check className="w-10 h-10 text-emerald-600" />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 bg-white rounded-[2rem] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 shadow-inner">
                                        <Camera className="w-10 h-10 mb-2 opacity-20" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">Identity Missing</span>
                                    </div>
                                )}
                                <Button type="button" onClick={startCamera} variant="outline" className="rounded-2xl border-slate-200 text-slate-600 font-bold px-8">
                                    {formData.imageUrl ? 'Retake Identity Photo' : 'Activate ID Camera'}
                                </Button>
                            </div>
                        )}
                        {/* Hidden canvas for capture */}
                        <canvas ref={canvasRef} width={320} height={240} className="hidden"></canvas>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="ghost" onClick={onCancel} className="font-bold text-slate-400">Cancel</Button>
                    <Button type="submit" disabled={loading || !formData.imageUrl} className="px-12 h-14 bg-indigo-600 font-black tracking-widest shadow-xl shadow-indigo-100 uppercase">
                        {loading ? 'PROCESSING...' : 'AUTHORIZE ENTRY'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

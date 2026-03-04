import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { societyService } from '../services/societyService';
import { joinRequestService } from '../services/joinRequestService';
import { notify } from '../utils/alerts';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
    Search,
    Home,
    Building2,
    MapPin,
    ChevronRight,
    ShieldCheck,
    Clock,
    CheckCircle2,
    FileText,
    LogOut,
    ArrowRight,
    SearchX
} from 'lucide-react';

export default function Onboarding() {
    const { user, logout } = useAuth();
    const [step, setStep] = useState(1); // 1: Search, 2: Select Flat, 3: Pending
    const [loadingState, setLoadingState] = useState(true); // Initial state check
    const [societies, setSocieties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSoc, setSelectedSoc] = useState(null);
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [flats, setFlats] = useState([]);
    const [myRequests, setMyRequests] = useState([]);

    const [formData, setFormData] = useState({
        flatId: '',
        residentType: 'OWNER',
        deedDocumentUrl: ''
    });

    useEffect(() => {
        const initialize = async () => {
            await Promise.all([
                fetchSocieties(),
                fetchMyRequests()
            ]);
            setLoadingState(false);
        };
        initialize();
    }, []);

    const fetchSocieties = async () => {
        try {
            const data = await societyService.getAllSocieties();
            setSocieties(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyRequests = async () => {
        try {
            const data = await joinRequestService.getUserRequests();
            setMyRequests(data);
            // If there's a pending or rejected application, stay on step 3 to show status
            if (data.length > 0) {
                const hasPending = data.some(r => r.status === 'PENDING');
                if (hasPending) {
                    setStep(3);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredSocieties = societies.filter(s =>
        s.societyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSelectSociety = async (soc) => {
        setSelectedSoc(soc);
        try {
            const b = await societyService.getBuildings(soc.societyId);
            setBuildings(b);
            setStep(2);
        } catch (err) {
            notify.error("Failed to load society infrastructure");
        }
    };

    const handleBuildingChange = async (buildingId) => {
        setSelectedBuilding(buildingId);
        try {
            const f = await societyService.getFlats(buildingId);
            setFlats(f);
        } catch (err) {
            notify.error("Failed to load flats");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await joinRequestService.submitRequest({
                flatId: Number(formData.flatId),
                residentType: formData.residentType,
                deedDocumentUrl: formData.deedDocumentUrl
            });
            notify.success("Residency application submitted!");
            await fetchMyRequests();
            setStep(3);
        } catch (err) {
            notify.error(err.response?.data?.message || "Submission failed");
        }
    };

    if (loadingState) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Synchronizing Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Simple Top Bar */}
            <nav className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-black text-slate-900 tracking-tighter">ECanopy<span className="text-indigo-600">.</span></span>
                </div>
                <button onClick={logout} className="flex items-center space-x-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-rose-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Terminate Session</span>
                </button>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 max-w-7xl mx-auto w-full">

                {step === 1 && (
                    <div className="w-full max-w-4xl space-y-12 fade-up">
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Find Your <span className="text-indigo-600 italic">Community.</span></h1>
                            <p className="text-slate-500 font-medium text-lg italic opacity-80">"Intelligence begins with connection. Search for your housing society."</p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-600/5 blur-3xl -z-10 rounded-full group-focus-within:bg-indigo-600/10 transition-colors"></div>
                            <div className="bg-white p-4 rounded-[3rem] shadow-2xl flex items-center space-x-4 border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                                <Search className="w-8 h-8 text-slate-300 ml-4" />
                                <input
                                    type="text"
                                    placeholder="Search by Society Name, Landmark or City..."
                                    className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-800 placeholder:text-slate-300 h-16"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hidden sm:block">
                                    {filteredSocieties.length} Societies Found
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                            {filteredSocieties.length > 0 ? (
                                filteredSocieties.map(soc => (
                                    <SocietyCard key={soc.societyId} society={soc} onSelect={() => handleSelectSociety(soc)} />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center flex flex-col items-center space-y-4 opacity-40">
                                    <SearchX className="w-12 h-12 text-slate-300" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest">No matching societies found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && selectedSoc && (
                    <div className="w-full max-w-5xl grid lg:grid-cols-3 gap-12 fade-up">
                        <div className="lg:col-span-2 space-y-10">
                            <button onClick={() => setStep(1)} className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center group">
                                <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                Back to search
                            </button>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-black text-slate-900">{selectedSoc.societyName}</h1>
                                <p className="text-slate-400 font-bold flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                                    {selectedSoc.address}, {selectedSoc.city}
                                </p>
                            </div>

                            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
                                <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center">
                                    <Home className="w-6 h-6 mr-3 text-indigo-600" />
                                    Identify Your Residence
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Wing / Building</label>
                                            <select
                                                className="w-full h-14 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 font-bold px-4 outline-none transition-all"
                                                onChange={(e) => handleBuildingChange(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Building</option>
                                                {buildings.map(b => <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Flat Number</label>
                                            <select
                                                className="w-full h-14 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 font-bold px-4 outline-none transition-all disabled:opacity-50"
                                                disabled={!selectedBuilding}
                                                value={formData.flatId}
                                                onChange={(e) => setFormData({ ...formData, flatId: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Flat</option>
                                                {flats.map(f => <option key={f.flatId} value={f.flatId}>{f.flatNumber} (Floor {f.floorNumber})</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role in Household</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['OWNER', 'TENANT'].map(t => (
                                                <label key={t} className={`flex items-center justify-center h-14 rounded-2xl border-2 cursor-pointer transition-all ${formData.residentType === t ? 'bg-indigo-600 border-indigo-600 text-white font-black' : 'bg-white border-slate-100 text-slate-400 font-bold'}`}>
                                                    <input type="radio" className="hidden" name="type" value={t} checked={formData.residentType === t} onChange={(e) => setFormData({ ...formData, residentType: e.target.value })} />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <Input
                                        label="Verification Link (Agreement/Proof)"
                                        placeholder="Drive Link to Ownership Deed or Lease"
                                        variant="modern"
                                        required
                                        value={formData.deedDocumentUrl}
                                        onChange={(e) => setFormData({ ...formData, deedDocumentUrl: e.target.value })}
                                    />

                                    <Button className="w-full h-16 rounded-[1.5rem] bg-indigo-600 font-black tracking-widest shadow-xl shadow-indigo-100" type="submit">
                                        INITIATE ONBOARDING
                                    </Button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
                                <ShieldCheck className="w-10 h-10 text-indigo-400 mb-6" />
                                <h3 className="text-xl font-black mb-4 tracking-tight">Security Check</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed italic opacity-80">
                                    Your application will be verified by the {selectedSoc.societyName} management. Access is usually granted within 24 hours.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Process Timeline</h3>
                                <div className="space-y-6">
                                    <TimelineItem icon={<CheckCircle2 className="text-indigo-600" />} label="Submit Proof" status="Active" />
                                    <TimelineItem icon={<Clock className="text-slate-300" />} label="Secretary Review" status="Pending" />
                                    <TimelineItem icon={<ShieldCheck className="text-slate-300" />} label="Ecosystem Access" status="Locked" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="w-full max-w-3xl space-y-12 fade-up">
                        <section className="bg-white p-16 rounded-[4rem] text-center shadow-2xl space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32"></div>

                            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto relative">
                                <Clock className="w-16 h-16 text-indigo-600 animate-pulse" />
                                <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 rounded-full border-4 border-white"></div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Pending Verification</h1>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md mx-auto italic opacity-80">
                                    "Excellence requires scrutiny. Your society administrator is currently reviewing your residency documents."
                                </p>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[2.5rem] inline-block border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Steps</p>
                                <p className="text-slate-600 font-bold text-sm">We'll notify you once access is granted. You'll then be able to pay bills, book amenities, and view notices.</p>
                            </div>

                            <div className="pt-8 flex flex-col items-center gap-6">
                                <Button className="bg-slate-900 text-white font-black px-10 py-5 rounded-3xl" onClick={() => window.location.reload()}>
                                    REFRESH STATUS
                                </Button>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Est. Completion: ~12 Hours</p>
                            </div>
                        </section>
                    </div>
                )}

            </main>

            <footer className="p-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                &copy; 2026 ECanopy Ecosystems &bull; Community Intelligence
            </footer>
        </div>
    );
}

function SocietyCard({ society, onSelect }) {
    return (
        <article className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-500">
                <Building2 className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{society.societyName}</h3>
            <p className="text-slate-500 font-medium text-sm mt-2 italic flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-slate-300" />
                {society.city}
            </p>
            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Active Units</p>
                    <p className="text-xs font-black text-slate-900">400+ Homes</p>
                </div>
                <button
                    onClick={onSelect}
                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </article>
    );
}

function TimelineItem({ icon, label, status }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-sm font-bold text-slate-600">{label}</span>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${status === 'Active' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300'}`}>{status}</span>
        </div>
    );
}

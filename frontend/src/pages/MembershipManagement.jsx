import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { joinRequestService } from '../services/joinRequestService';
import { societyService } from '../services/societyService';
import { notify, confirmAction } from '../utils/alerts';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
    UserPlus,
    ShieldCheck,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    User,
    MapPin,
    RefreshCcw,
    ChevronRight,
    ArrowRight,
    Search,
    Info
} from 'lucide-react';

export default function MembershipManagement() {
    const { user } = useAuth();
    const isAdmin = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_SECRETARY', 'ROLE_RWA_PRESIDENT', 'ADMIN', 'RWA_SECRETARY', 'RWA_PRESIDENT'].includes(r));
    const isResident = user?.roles?.includes('ROLE_RESIDENT');

    const [activeTab, setActiveTab] = useState(isAdmin ? 'QUEUE' : 'SUBMIT');
    const [requests, setRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [societies, setSocieties] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [flats, setFlats] = useState([]);
    const [selectedSociety, setSelectedSociety] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [formData, setFormData] = useState({
        flatId: '',
        residentType: 'OWNER',
        deedDocumentUrl: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isAdmin) {
                const data = await joinRequestService.getPendingRequests(user.societyId);
                setRequests(data);
            }
            // All users can see their own requests (even if they become residents)
            const myData = await joinRequestService.getUserRequests();
            setMyRequests(myData);

            // Fetch societies for the form
            if (!isResident || isAdmin) {
                const socs = await societyService.getAllSocieties();
                setSocieties(socs);
            }
        } catch (err) {
            console.error("Failed to fetch membership data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    // Form Effects
    useEffect(() => {
        if (!selectedSociety) {
            setBuildings([]);
            return;
        }
        societyService.getBuildings(selectedSociety).then(setBuildings).catch(console.error);
    }, [selectedSociety]);

    useEffect(() => {
        if (!selectedBuilding) {
            setFlats([]);
            return;
        }
        societyService.getFlats(selectedBuilding).then(setFlats).catch(console.error);
    }, [selectedBuilding]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.flatId) throw new Error("Please select a flat");
            await joinRequestService.submitRequest({
                flatId: Number(formData.flatId),
                residentType: formData.residentType,
                deedDocumentUrl: formData.deedDocumentUrl
            });
            notify.success("Application submitted successfully!");
            fetchData();
            setActiveTab('HISTORY');
        } catch (err) {
            notify.error(err.response?.data?.message || err.message);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        const result = await confirmAction({
            title: status === 'APPROVED' ? 'Approve Entry?' : 'Reject Request?',
            text: `Confirm residency for this user?`,
            confirmText: 'Yes, Proceed'
        });

        if (result.isConfirmed) {
            try {
                await joinRequestService.updateStatus(requestId, status);
                notify.success(`Request ${status.toLowerCase()}ed`);
                fetchData();
            } catch (err) {
                notify.error('Action failed');
            }
        }
    };

    return (
        <div className="space-y-10 fade-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Community Hub</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Manage memberships and residency applications.</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {isAdmin && (
                        <TabButton
                            active={activeTab === 'QUEUE'}
                            onClick={() => setActiveTab('QUEUE')}
                            label="Verification Queue"
                            count={requests.length}
                        />
                    )}
                    {!isResident && (
                        <TabButton
                            active={activeTab === 'SUBMIT'}
                            onClick={() => setActiveTab('SUBMIT')}
                            label="Join Society"
                        />
                    )}
                    <TabButton
                        active={activeTab === 'HISTORY'}
                        onClick={() => setActiveTab('HISTORY')}
                        label="My Applications"
                        count={myRequests.length}
                    />
                </div>
            </header>

            <main>
                {activeTab === 'QUEUE' && isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {requests.length === 0 ? (
                            <EmptyState icon={<UserPlus />} title="Queue Cleared" desc="No pending verification requests." />
                        ) : (
                            requests.map(req => <AdminRequestCard key={req.requestId} request={req} onUpdate={handleStatusUpdate} />)
                        )}
                    </div>
                )}

                {activeTab === 'SUBMIT' && !isResident && (
                    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Residency Form</h2>
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Network Access</label>
                                    <select
                                        className="w-full h-14 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold px-4 outline-none transition-all"
                                        value={selectedSociety}
                                        onChange={(e) => {
                                            setSelectedSociety(e.target.value);
                                            setSelectedBuilding('');
                                            setFormData({ ...formData, flatId: '' });
                                        }}
                                        required
                                    >
                                        <option value="">Select a Society</option>
                                        {societies.map(s => <option key={s.societyId} value={s.societyId}>{s.societyName}</option>)}
                                    </select>

                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            className="h-14 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold px-4 outline-none disabled:opacity-50 transition-all"
                                            value={selectedBuilding}
                                            onChange={(e) => setSelectedBuilding(e.target.value)}
                                            disabled={!selectedSociety}
                                            required
                                        >
                                            <option value="">Building</option>
                                            {buildings.map(b => <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>)}
                                        </select>
                                        <select
                                            className="h-14 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold px-4 outline-none disabled:opacity-50 transition-all"
                                            value={formData.flatId}
                                            onChange={(e) => setFormData({ ...formData, flatId: e.target.value })}
                                            disabled={!selectedBuilding}
                                            required
                                        >
                                            <option value="">Flat No.</option>
                                            {flats.map(f => <option key={f.flatId} value={f.flatId}>{f.flatNumber}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ownership Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`flex items-center justify-center h-14 rounded-2xl border-2 cursor-pointer transition-all ${formData.residentType === 'OWNER' ? 'bg-indigo-600 border-indigo-600 text-white font-black' : 'bg-white border-slate-100 text-slate-400 font-bold'}`}>
                                            <input type="radio" className="hidden" name="type" value="OWNER" checked={formData.residentType === 'OWNER'} onChange={e => setFormData({ ...formData, residentType: e.target.value })} />
                                            OWNER
                                        </label>
                                        <label className={`flex items-center justify-center h-14 rounded-2xl border-2 cursor-pointer transition-all ${formData.residentType === 'TENANT' ? 'bg-indigo-600 border-indigo-600 text-white font-black' : 'bg-white border-slate-100 text-slate-400 font-bold'}`}>
                                            <input type="radio" className="hidden" name="type" value="TENANT" checked={formData.residentType === 'TENANT'} onChange={e => setFormData({ ...formData, residentType: e.target.value })} />
                                            TENANT
                                        </label>
                                    </div>
                                </div>

                                <Input
                                    label="Document Proof (URL)"
                                    placeholder="Link to Agreement/Deed"
                                    value={formData.deedDocumentUrl}
                                    onChange={e => setFormData({ ...formData, deedDocumentUrl: e.target.value })}
                                    variant="modern"
                                />

                                <Button className="w-full h-16 rounded-[1.5rem] bg-indigo-600 font-black tracking-widest shadow-xl shadow-indigo-100" type="submit">
                                    APPLY FOR VERIFICATION
                                </Button>
                            </form>
                        </div>

                        <div className="lg:w-80 space-y-6">
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-3xl opacity-20 group-hover:scale-150 transition-transform"></div>
                                <Info className="w-8 h-8 text-indigo-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Why Verify?</h3>
                                <p className="text-slate-400 text-xs leading-relaxed font-medium">Verification ensures security and grants access to amenities, bill payments, and community notices.</p>
                            </div>
                            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                                <Clock className="w-8 h-8 text-indigo-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Timeline</h3>
                                <p className="text-indigo-700/70 text-[10px] font-black uppercase tracking-widest">Est. 24-48 Hours</p>
                                <p className="text-slate-600 text-[10px] mt-2 font-medium">Approval depends on RWA secretary verification of your documents.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'HISTORY' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        {myRequests.length === 0 ? (
                            <EmptyState icon={<Clock />} title="No Records" desc="You haven't submitted any join requests yet." />
                        ) : (
                            myRequests.map(req => <UserRequestRow key={req.requestId} request={req} />)
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

function TabButton({ active, onClick, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${active ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
        >
            {label}
            {count > 0 && <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${active ? 'bg-indigo-600' : 'bg-slate-100'}`}>{count}</span>}
        </button>
    );
}

function EmptyState({ icon, title, desc }) {
    return (
        <div className="w-full py-24 bg-white/50 border-2 border-dashed border-slate-100 rounded-[3rem] text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                {icon}
            </div>
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">{desc}</p>
        </div>
    );
}

function AdminRequestCard({ request, onUpdate }) {
    return (
        <article className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl"></div>
            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <User className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-amber-100">PENDING</span>
                </div>
                <div>
                    <h4 className="text-xl font-black text-slate-900 truncate">{request.userName}</h4>
                    <p className="text-xs font-medium text-slate-400">{request.userEmail}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Flat</p>
                        <p className="text-sm font-black text-slate-800">{request.flatNumber}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                        <p className="text-sm font-black text-slate-800">{request.residentType}</p>
                    </div>
                </div>
                {request.deedDocumentUrl && (
                    <a href={request.deedDocumentUrl} target="_blank" className="flex items-center gap-3 text-indigo-600 font-bold text-xs hover:underline">
                        View Documents <ArrowRight className="w-3 h-3" />
                    </a>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => onUpdate(request.requestId, 'REJECTED')} className="h-12 rounded-xl bg-slate-50 text-slate-400 font-black text-[10px] hover:bg-rose-50 hover:text-rose-600 transition-colors uppercase tracking-widest">Reject</button>
                    <button onClick={() => onUpdate(request.requestId, 'APPROVED')} className="h-12 rounded-xl bg-indigo-600 text-white font-black text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest">Approve</button>
                </div>
            </div>
        </article>
    );
}

function UserRequestRow({ request }) {
    const statusColors = {
        PENDING: "bg-amber-50 text-amber-600 border-amber-100",
        APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
        REJECTED: "bg-rose-50 text-rose-600 border-rose-100"
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-black text-slate-900 tracking-tight">Society Join Request</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        Applied on {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-10">
                <div className="hidden sm:flex flex-col items-end">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Application For</p>
                    <p className="text-sm font-black text-slate-900">Flat {request.flatNumber}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[request.status]}`}>
                    {request.status}
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-400 transition-colors" />
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { visitorService } from '../services/visitorService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ShieldCheck, UserPlus, Clock, MoreHorizontal, Phone, CheckCircle2, XCircle, ChevronRight, History, AlertTriangle, Car, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Visitors() {
    const { user } = useAuth();
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [residentId, setResidentId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [preApproval, setPreApproval] = useState({
        visitorName: '',
        visitorPhone: '',
        category: 'GUEST',
        validUntil: '',
        code: ''
    });

    const pendingApprovals = visitors.filter(v => v.status === 'PENDING');

    useEffect(() => {
        const fetchResidentId = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`http://localhost:8080/api/resident/user/${user.id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (response.ok) {
                        const residentData = await response.json();
                        setResidentId(residentData.residentId);
                    }
                } catch (error) {
                    console.error('Error fetching resident ID:', error);
                }
            }
        };
        fetchResidentId();
    }, [user?.id]);

    const fetchHistory = async () => {
        if (!user?.flatId) return;
        try {
            const data = await visitorService.getVisitorsByFlat(user.flatId);
            // Sort: Pending first, then by time (newest first)
            const sortedData = [...data].sort((a, b) => {
                if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                return new Date(b.inTime) - new Date(a.inTime);
            });
            setVisitors(sortedData);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.flatId) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user?.flatId]);

    const handlePreApprove = async (e) => {
        e.preventDefault();

        if (!residentId) {
            toast.error("Resident profile not loaded. Please refresh.");
            return;
        }

        try {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const payload = {
                visitorName: preApproval.visitorName,
                visitorPhone: preApproval.visitorPhone,
                category: preApproval.category,
                validFrom: now.toISOString(),
                validUntil: preApproval.validUntil ? new Date(preApproval.validUntil).toISOString() : tomorrow.toISOString(),
                resident: { residentId: residentId },
                flat: { flatId: user.flatId }
            };

            console.log("Sending PreApproval:", payload);

            const result = await visitorService.createPreApproval(payload);

            await Swal.fire({
                title: 'Digital Gate Pass',
                html: `
                    <div class="text-center">
                        <p class="text-slate-400 mb-4 font-medium">Share this secure code with your guest:</p>
                        <div class="bg-indigo-50 border-2 border-indigo-100 rounded-2xl py-6 mb-4">
                            <span class="text-5xl font-black text-indigo-600 tracking-[0.5em] font-mono">${result.code}</span>
                        </div>
                        <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Valid until ${new Date(result.validUntil).toLocaleDateString()}</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Done',
                customClass: {
                    popup: 'rounded-[3rem] shadow-2xl',
                    confirmButton: 'bg-indigo-600 px-8 py-3 rounded-xl font-bold uppercase tracking-widest'
                }
            });

            setShowModal(false);
            setPreApproval({ visitorName: '', visitorPhone: '', category: 'GUEST', validUntil: '', code: '' });
        } catch (error) {
            toast.error('Failed to create pre-approval');
        }
    };

    const handleApprove = async (logId) => {
        try {
            await visitorService.approve(logId);
            toast.success('Visitor Approved!');
            fetchHistory();
        } catch (error) {
            toast.error('Failed to approve');
        }
    };

    const handleReject = async (logId) => {
        const result = await Swal.fire({
            title: 'Reject Visitor?',
            text: "Are you sure you want to deny entry to this visitor?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Reject',
            borderRadius: '2rem',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        });

        if (result.isConfirmed) {
            try {
                await visitorService.reject(logId);
                toast.success('Visitor rejected');
                fetchHistory();
            } catch (error) {
                toast.error('Failed to reject');
            }
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'CHECKED_IN':
            case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'CHECKED_OUT': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="space-y-10 fade-up pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Visitors & Gate</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage society entry and guest pre-approvals</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="rounded-3xl bg-indigo-600 px-8 py-4 font-bold shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Create Pass</span>
                </Button>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="absolute right-[-10%] top-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                    <ShieldCheck className="w-12 h-12 mb-6 text-indigo-200" />
                    <h3 className="text-2xl font-black mb-1">Digital Gate</h3>
                    <p className="text-indigo-100/80 text-sm font-medium">Pre-approved visitors bypass verification for 24h</p>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all border-b-4 border-b-amber-500/10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="p-3 bg-amber-50 rounded-2xl">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Active Now</span>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-900 mb-1">
                            {visitors.filter(v => v.status === 'CHECKED_IN').length}
                        </h3>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Visitors Inside</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all border-b-4 border-b-rose-500/10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="p-3 bg-rose-50 rounded-2xl">
                            <AlertTriangle className="w-6 h-6 text-rose-600" />
                        </div>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">Attention</span>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-900 mb-1">{pendingApprovals.length}</h3>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Need Approval</p>
                    </div>
                </div>
            </div>

            {/* Awaiting Approvals - Conditional Alert Style */}
            {pendingApprovals.length > 0 && (
                <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 p-2 rounded-[3.5rem] animate-pulse-subtle">
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-amber-900/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center">
                                <ShieldCheck className="w-8 h-8 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-1">Awaiting Your Approval</h3>
                                <p className="text-slate-500 font-medium">{pendingApprovals.length} visitor(s) waiting at the main gate</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {pendingApprovals.slice(0, 3).map(v => (
                                <div key={v.logId} className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg overflow-hidden ring-4 ring-amber-50">
                                    <img src={v.imageUrl ? `http://localhost:8080${v.imageUrl}` : `https://ui-avatars.com/api/?name=${v.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                            {pendingApprovals.length > 3 && (
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-lg flex items-center justify-center text-slate-400 font-black text-sm">
                                    +{pendingApprovals.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Activity Log */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/20 overflow-hidden">
                <header className="px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <History className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Gate Activity Log</h3>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl px-5">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Real-time Sync Active</span>
                    </div>
                </header>

                <div className="divide-y divide-slate-50">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Activity...</p>
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="py-24 text-center px-10">
                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <History className="w-8 h-8 text-slate-200" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-2">No activity found</h4>
                            <p className="text-slate-400 font-medium">Visitor logs will appear here as they are entered at the gate.</p>
                        </div>
                    ) : (
                        visitors.map((visitor) => (
                            <div key={visitor.logId} className="px-12 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-slate-50/50 transition-all group">
                                <div className="flex items-center gap-8">
                                    {/* Avatar/Photo */}
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[2rem] bg-slate-100 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500 border-2 border-white shadow-xl">
                                            {visitor.imageUrl ? (
                                                <img src={`http://localhost:8080${visitor.imageUrl}`} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                    <User className="w-8 h-8 text-slate-200" />
                                                </div>
                                            )}
                                        </div>
                                        {visitor.status === 'CHECKED_IN' && (
                                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{visitor.name}</h4>
                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{visitor.category}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-bold text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-indigo-400" />
                                                <span>{visitor.phone}</span>
                                            </div>
                                            {visitor.vehicleNumber && (
                                                <div className="flex items-center gap-2">
                                                    <Car className="w-4 h-4 text-rose-400" />
                                                    <span className="uppercase">{visitor.vehicleNumber}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-emerald-400" />
                                                <span>{new Date(visitor.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-10">
                                    {/* Detailed Time */}
                                    <div className="hidden sm:block text-right">
                                        <p className="text-base font-black text-slate-900 mb-0.5">{new Date(visitor.inTime).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Gateway: Main Entry</p>
                                    </div>

                                    {/* Action/Status */}
                                    <div className="flex items-center gap-6">
                                        <span className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${getStatusStyles(visitor.status)}`}>
                                            {visitor.status.replace('_', ' ')}
                                        </span>

                                        {visitor.status === 'PENDING' ? (
                                            <div className="flex gap-3 scale-110">
                                                <button
                                                    onClick={() => handleApprove(visitor.logId)}
                                                    className="p-3 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all"
                                                    title="Approve Entry"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(visitor.logId)}
                                                    className="p-3 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-100 hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all"
                                                    title="Deny Entry"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="p-3 bg-slate-50 text-slate-300 rounded-2xl hover:bg-slate-100 hover:text-slate-400 transition-all">
                                                <MoreHorizontal className="w-6 h-6" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <footer className="px-12 py-8 bg-slate-50/50 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">End of security logs for Flat {user?.flatNumber || user?.flatId || 'N/A'}</p>
                </footer>
            </div>

            {/* Pre-Approval Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[4rem] shadow-full max-w-lg w-full p-12 border border-white/20 relative animate-in slide-in-from-bottom-8 duration-500">
                        <header className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Create Pass</h3>
                                <p className="text-slate-400 font-medium">Generate an instant entry code for your guest</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </header>

                        <form onSubmit={handlePreApprove} className="space-y-8">
                            <div className="space-y-6">
                                <Input label="Guest Name" required placeholder="Ex: John Doe" value={preApproval.visitorName} onChange={(e) => setPreApproval({ ...preApproval, visitorName: e.target.value })} className="rounded-2xl h-16 px-6 font-bold" />
                                <Input label="Phone Number" required placeholder="10-digit mobile" value={preApproval.visitorPhone} onChange={(e) => setPreApproval({ ...preApproval, visitorPhone: e.target.value })} className="rounded-2xl h-16 px-6 font-bold" />
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 rounded-[2rem] h-20 text-lg font-black shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-95">
                                Generate Digital Code
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
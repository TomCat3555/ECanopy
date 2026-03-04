import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { societyService } from '../services/societyService';
import { adminService } from '../services/adminService';
import { residentService } from '../services/residentService';
import Button from '../components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import {
    Users,
    CreditCard,
    MessageSquare,
    Bell,
    Shield,
    Clock,
    Plus,
    UserPlus,
    Flame,
    Zap,
    TrendingUp,
    ShieldCheck,
    ArrowUpRight,
    Map
} from 'lucide-react';
import { notify } from '../utils/alerts';
import Onboarding from './Onboarding';

export default function DashboardHome() {
    const { user } = useAuth();
    const [adminStats, setAdminStats] = useState(null);
    const [residentStats, setResidentStats] = useState(null);
    const [societyCount, setSocietyCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const isSuperAdmin = user?.roles?.includes('ROLE_SUPER_ADMIN');
    const isManager = user?.roles?.some(role => ['ROLE_ADMIN', 'ROLE_RWA_SECRETARY', 'ROLE_RWA_PRESIDENT', 'ADMIN', 'RWA_SECRETARY', 'RWA_PRESIDENT'].includes(role));

    // If user is a resident BUT hasn't been linked to a society yet, they need onboarding
    const needsOnboarding = !isSuperAdmin && !user?.societyId;

    useEffect(() => {
        const fetchStats = async () => {
            if (needsOnboarding) {
                setLoading(false);
                return;
            }
            try {
                if (isSuperAdmin) {
                    const societies = await societyService.getAllSocieties();
                    setSocietyCount(societies.length);
                } else if (isManager) {
                    const data = await adminService.getDashboardStats();
                    setAdminStats(data);
                } else {
                    const data = await residentService.getDashboardStats();
                    setResidentStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, isSuperAdmin, isManager, needsOnboarding]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (needsOnboarding) {
        return <Onboarding />;
    }

    // --- SUPER ADMIN VIEW ---
    if (isSuperAdmin) {
        return (
            <div className="space-y-10">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Command</h1>
                        <p className="text-slate-500 mt-1 font-medium italic">Empowering community governance at scale.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-950 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[320px]">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-30 -mr-48 -mt-48"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white mb-4">Network Growth</h2>
                            <p className="text-slate-400 max-w-md font-medium">Monitoring {societyCount} registered societies across the platform ecosystem.</p>
                        </div>
                        <div className="relative z-10 flex gap-4">
                            <Button className="bg-white text-slate-950 font-black px-8 py-4 rounded-2xl hover:bg-slate-100" onClick={() => window.location.href = '/dashboard/society-setup'}>
                                REGISTER NEW SOCIETY
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col justify-center text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Ecosystem Users</p>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">8.4k+</h2>
                        <div className="mt-6 flex justify-center -space-x-3">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100"></div>)}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black">+</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MANAGER VIEW ---
    if (isManager && adminStats) {
        return (
            <div className="space-y-10 fade-up">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Summary</h1>
                        <p className="text-slate-500 mt-1 font-medium italic">Operational intelligence for your society.</p>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ManagerStat icon={<Users />} value={adminStats.totalResidents} label="Verified Residents" color="text-indigo-600" bg="bg-indigo-50" />
                    <ManagerStat icon={<Clock />} value={adminStats.todaysVisitors} label="Gate Pass Entrants" color="text-amber-600" bg="bg-amber-50" />
                    <ManagerStat icon={<MessageSquare />} value={adminStats.pendingComplaints} label="Active Grievances" color="text-rose-600" bg="bg-rose-50" />
                    <ManagerStat icon={<CreditCard />} value={`₹${adminStats.pendingDues.toLocaleString()}`} label="Outstanding Ledger" color="text-emerald-600" bg="bg-emerald-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                            <header className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900">Current Priorities</h3>
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                </div>
                            </header>
                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PriorityCard
                                    label="Join Requests"
                                    count={adminStats.pendingJoinRequests}
                                    desc="New residents awaiting verification"
                                    btnLabel="Pending Lists"
                                    color="indigo"
                                    onClick={() => window.location.href = '/dashboard/membership'}
                                />
                                <PriorityCard
                                    label="Grievances"
                                    count={adminStats.pendingComplaints}
                                    desc="Unresolved resident issues"
                                    btnLabel="Resolve Now"
                                    color="rose"
                                    onClick={() => window.location.href = '/dashboard/complaints'}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                            <header className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900">Society Bulletins</h3>
                                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => window.location.href = '/dashboard/notices'}>
                                    <Plus className="w-5 h-5 text-indigo-600" />
                                </button>
                            </header>
                            <div className="p-10">
                                {adminStats.activeNotices > 0 ? (
                                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative group cursor-pointer overflow-hidden border border-indigo-500 shadow-2xl shadow-indigo-100" onClick={() => window.location.href = '/dashboard/notices'}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                        <h4 className="text-2xl font-black mb-2">Broadcasts Active</h4>
                                        <p className="text-indigo-100 text-sm font-medium">You have {adminStats.activeNotices} active notices published for residents.</p>
                                        <ArrowUpRight className="absolute bottom-8 right-8 w-8 h-8 opacity-50" />
                                    </div>
                                ) : (
                                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center flex flex-col items-center">
                                        <Bell className="w-10 h-10 text-slate-200 mb-4" />
                                        <p className="text-slate-300 font-bold italic">No critical broadcasts active.</p>
                                        <button className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest" onClick={() => window.location.href = '/dashboard/notices'}>Create Notice</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-40"></div>
                            <h3 className="text-white text-xl font-black mb-1 relative z-10">Control Panel</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8 relative z-10">Administrative Operations</p>
                            <div className="space-y-4 relative z-10">
                                <ControlAction icon={<Bell />} label="Broadcast Notice" href="/dashboard/notices" />
                                <ControlAction icon={<CreditCard />} label="Financial Ledger" href="/dashboard/maintenance" />
                                <ControlAction icon={<Users />} label="Manage Residents" href="/dashboard/users" />
                                <ControlAction icon={<Shield />} label="Guard Deployment" href="/dashboard/guard-registration" />
                                <ControlAction icon={<Clock />} label="Security Records" href="/dashboard/visitors" />
                                <ControlAction icon={<Zap />} label="Amenity Bookings" href="/dashboard/amenities" />
                            </div>
                        </div>

                        <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-emerald-200">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900">Governance Active</h4>
                            <p className="text-emerald-700 text-[10px] font-bold mt-1 uppercase tracking-tighter">Your society portal is fully operational</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RESIDENT VIEW ---
    if (residentStats) {
        return (
            <div className="space-y-10 pb-20">
                <section className="bg-slate-950 p-10 md:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl shadow-indigo-100/20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[140px] opacity-20 -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-10 -ml-32 -mb-32"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div>
                            <div className="flex items-center space-x-3 text-indigo-400 mb-4 px-1">
                                <Zap className="w-5 h-5 fill-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Resident Space</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                                Greetings, <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                    {user.fullName.split(' ')[0]}
                                </span>
                            </h1>
                            <p className="text-slate-400 mt-6 font-medium text-lg italic opacity-80 max-w-md">"The art of living is the art of giving." Welcome back home.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
                            <div className="bg-white p-4 rounded-[2rem] shadow-inner mb-4">
                                <QRCodeSVG value={`RESIDENT:${user.id}:${user.fullName}`} size={160} />
                            </div>
                            <div className="text-center">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-60">Digital Gate Pass</p>
                                <p className="text-indigo-400 font-black text-lg mt-1">{user.flatNumber || "Access Key"}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <ResidentMetric icon={<CreditCard />} value={`₹${residentStats.pendingDues.toLocaleString()}`} label="Awaiting Dues" color="text-rose-500" bg="bg-rose-50" />
                    <ResidentMetric icon={<MessageSquare />} value={residentStats.activeComplaints} label="Pending Resolution" color="text-amber-500" bg="bg-amber-50" />
                    <ResidentMetric icon={<Clock />} value={residentStats.upcomingBookings} label="Slot Reservations" color="text-indigo-500" bg="bg-indigo-50" />
                    <ResidentMetric icon={<Bell />} value={residentStats.unreadNotices} label="Fresh Updates" color="text-emerald-500" bg="bg-emerald-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
                                Essentials <span className="ml-3 text-[10px] font-black text-slate-400 italic">Quick Access</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <ServiceTile icon={<UserPlus />} label="Guest" onClick={() => window.location.href = '/dashboard/my-visitors'} color="from-rose-500 to-orange-500" />
                                <ServiceTile icon={<Plus />} label="Support" onClick={() => window.location.href = '/dashboard/complaints'} color="from-indigo-500 to-blue-500" />
                                <ServiceTile icon={<Flame />} label="Social" onClick={() => window.location.href = '/dashboard/amenities'} color="from-indigo-600 to-purple-600" />
                                <ServiceTile icon={<ShieldCheck />} label="Guard" onClick={() => notify.success("Emergency Response Sequence Initiated. Security is on the way.")} color="from-slate-700 to-slate-900" />
                            </div>
                        </section>

                        <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                            <header className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-slate-900">Entrance History</h3>
                                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform" onClick={() => window.location.href = '/dashboard/my-visitors'}>Full Records</button>
                            </header>
                            <div className="divide-y divide-slate-50">
                                {residentStats.recentVisitors?.length > 0 ? (
                                    residentStats.recentVisitors.map((v, i) => (
                                        <div key={i} className="px-10 py-6 flex flex-col md:flex-row md:items-center justify-between group hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center space-x-6">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-all">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{v.visitorName}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">{v.visitorType} <span className="mx-2 opacity-30">•</span> {v.checkInTime}</p>
                                                </div>
                                            </div>
                                            <span className={`mt-4 md:mt-0 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest self-start md:self-center bg-slate-100 text-slate-500 transition-all group-hover:bg-indigo-600 group-hover:text-white`}>
                                                {v.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center text-slate-300 font-bold italic italic">No Entrance Logs recorded.</div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-10">
                        <section className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-50"></div>
                            <Map className="w-12 h-12 mb-6 text-indigo-200" />
                            <h3 className="text-2xl font-black mb-3">Estate News</h3>
                            <p className="text-indigo-100 text-sm font-medium mb-8 leading-relaxed italic opacity-80">"Scheduled water tank cleaning on Sunday 10 AM. Anticipate 2-hour outage."</p>
                            <Button className="w-full h-14 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 shadow-xl shadow-indigo-950/20" onClick={() => window.location.href = '/dashboard/notices'}>
                                View Bulletins
                            </Button>
                        </section>

                        <div className="bg-rose-50 p-10 rounded-[3.5rem] border-2 border-rose-100">
                            <h4 className="flex items-center space-x-2 text-rose-600 mb-6 bg-rose-100/50 w-fit px-4 py-2 rounded-full border border-rose-200/50">
                                <Shield className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Help Desk Access</span>
                            </h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Gate Main Terminal</p>
                                    <p className="text-rose-900 font-black text-xl tabular-nums">9821 000 456</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Estate Supervisor</p>
                                    <p className="text-rose-900 font-black text-xl tabular-nums">9821 000 789</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

function ManagerStat({ icon, value, label, color, bg }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className={`${bg} ${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                {icon}
            </div>
            <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
        </div>
    );
}

function ControlAction({ icon, label, href }) {
    return (
        <button
            onClick={() => window.location.href = href}
            className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group"
        >
            <div className="flex items-center space-x-4">
                <div className="text-indigo-400 group-hover:text-white transition-colors">{icon}</div>
                <span className="text-sm font-black text-slate-300 group-hover:text-white">{label}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-all" />
        </button>
    );
}

function ResidentMetric({ icon, value, label, color, bg }) {
    return (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center space-x-6 transition-all duration-300">
            <div className={`w-14 h-14 ${bg} ${color} rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-current/5`}>
                {icon}
            </div>
            <div>
                <h4 className="text-xl font-black text-slate-900 leading-none mb-1">{value}</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}

function PriorityCard({ label, count, desc, btnLabel, color, onClick }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100"
    };

    const btnColors = {
        indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
        rose: "bg-rose-600 text-white hover:bg-rose-700",
        amber: "bg-amber-600 text-white hover:bg-amber-700"
    };

    return (
        <div className={`p-8 rounded-[2rem] border ${colors[color]} flex flex-col justify-between h-full`}>
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
                    <span className="text-3xl font-black">{count}</span>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-6">{desc}</p>
            </div>
            <button
                onClick={onClick}
                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${btnColors[color]}`}
            >
                {btnLabel}
            </button>
        </div>
    );
}

function ServiceTile({ icon, label, onClick, color }) {
    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center justify-center gap-4 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300"
        >
            <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-xl shadow-current/20 transition-transform`}>
                {icon}
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{label}</span>
        </button>
    );
}

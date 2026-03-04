import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { visitorService } from '../services/visitorService';
import Button from '../components/ui/Button';
import AddVisitorForm from './AddVisitorForm';
import VisitorStatusBadge from '../components/VisitorStatusBadge';
import { confirmAction, notify } from '../utils/alerts';
import Swal from 'sweetalert2';
import { accessService } from '../services/accessService';
import {
    RefreshCw,
    Search,
    X,
    Scan,
    History,
    UserCheck,
    Filter,
    Camera,
    ShieldCheck,
    ArrowUpRight,
    ExternalLink
} from 'lucide-react';

export default function VisitorDashboard() {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('active'); // 'active' or 'history'
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const fetchVisitors = useCallback(async () => {
        if (!user?.societyId) return;
        try {
            setLoading(true);
            let data;
            if (viewMode === 'active') {
                data = await visitorService.getActiveVisitors(user.societyId);
            } else {
                data = await visitorService.getVisitorHistory(user.societyId);
            }
            setVisitors(data);
        } catch (err) {
            setError('Failed to fetch visitors');
            notify.error("Connection error while fetching logs.");
        } finally {
            setLoading(false);
        }
    }, [viewMode, user?.societyId]);

    useEffect(() => {
        fetchVisitors();
    }, [fetchVisitors]);

    const [manualCode, setManualCode] = useState('');

    const handleScanSuccess = async (decodedText) => {
        try {
            setShowScanner(false);
            const result = await accessService.validateQr(decodedText);
            await Swal.fire({
                title: 'Identity Verified',
                html: `
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Personnel</p>
                                <p class="text-lg font-black text-slate-900">${result.name}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                            <div>
                                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Class</p>
                                <p class="font-bold text-slate-700">${result.type}</p>
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Action</p>
                                <p class="font-bold text-indigo-600">${result.accessType}</p>
                            </div>
                        </div>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'OPEN GATE',
                customClass: {
                    popup: 'rounded-[3rem] border-none shadow-2xl',
                    confirmButton: 'bg-indigo-600 px-10 py-4 font-black rounded-2xl tracking-widest'
                }
            });
            fetchVisitors();
            setManualCode('');
        } catch (err) {
            console.error("Scan Error", err);
            const msg = err.response?.data?.message || "Invalid Security Token";
            notify.error(msg);
        }
    };

    const handleManualCodeSubmit = (e) => {
        e.preventDefault();
        handleScanSuccess(manualCode);
    };

    // QR Scanner Lifecycle Management
    useEffect(() => {
        let scanner = null;

        if (showScanner) {
            const timer = setTimeout(() => {
                import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
                    scanner = new Html5QrcodeScanner(
                        "reader",
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                            aspectRatio: 1.0
                        },
                        false
                    );

                    scanner.render(async (decodedText) => {
                        await scanner.clear();
                        handleScanSuccess(decodedText);
                    }, (errorMessage) => {
                        // Suppress parse noise
                    });
                }).catch(err => {
                    console.error("Library load factor", err);
                    notify.error("Scanner engine failed to initialize");
                });
            }, 100);

            return () => {
                clearTimeout(timer);
                if (scanner) {
                    scanner.clear().catch(e => console.warn("Scanner cleanup warning", e));
                }
            };
        }
    }, [showScanner, fetchVisitors]);

    const handleSearch = async () => {
        if (!user?.societyId) return;
        try {
            setLoading(true);
            const data = await visitorService.searchVisitors(
                user.societyId,
                searchTerm,
                searchTerm
            );
            setVisitors(data);
        } catch (err) {
            setError('Search failed');
            notify.error("Search system unavailable");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterByCategory = async (category) => {
        if (!user?.societyId) return;
        setFilterCategory(category);
        if (!category) {
            fetchVisitors();
            return;
        }
        try {
            setLoading(true);
            const data = await visitorService.filterByCategory(user.societyId, category);
            setVisitors(data);
        } catch (err) {
            setError('Filter failed');
            notify.error("Filtering logic error");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (visitorId) => {
        const result = await confirmAction({
            title: 'Confirm Departure?',
            text: 'Is the visitor officially exiting the premises?',
            confirmText: 'LOG EXIT'
        });

        if (result.isConfirmed) {
            try {
                await visitorService.checkOut(visitorId);
                notify.success('Departure logged successfully');
                fetchVisitors();
            } catch (err) {
                notify.error("Failed to process departure log");
            }
        }
    };

    const handleCheckInSuccess = (logId, status) => {
        setShowForm(false);
        fetchVisitors();
        if (status === 'APPROVED') {
            notify.success("Identity Authorized. Entry Logged.");
        } else {
            notify.info("Presence flagged. Awaiting resident clearance.");
        }
    };

    return (
        <div className="space-y-10 fade-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gate Surveillance</h2>
                    <p className="text-slate-500 mt-1 font-medium">Real-time visitor monitoring and access control</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => setShowScanner(true)}
                        className="rounded-2xl border-slate-200 bg-white text-slate-700 font-bold px-6 shadow-xl shadow-slate-200/20 hover:bg-slate-50 border"
                    >
                        <Scan className="w-4 h-4 mr-2 text-indigo-600" /> IDENTITY SCAN
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="rounded-2xl bg-indigo-600 px-6 font-black shadow-xl shadow-indigo-100/50 flex items-center"
                    >
                        <Camera className="w-4 h-4 mr-2" /> ENROLL VISITOR
                    </Button>
                </div>
            </header>

            {showScanner && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300">
                    <div className="bg-white p-10 rounded-[4rem] w-full max-w-xl relative shadow-2xl scale-in group">
                        <button
                            onClick={() => setShowScanner(false)}
                            className="absolute top-6 right-6 p-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-full transition-all duration-300"
                        >
                            <X className="w-8 h-8 font-black" />
                        </button>
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Lens Recognition</h3>
                            <p className="text-slate-400 font-medium">Position the Security QR within the viewport</p>
                        </div>
                        <div id="reader" className="w-full rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-inner"></div>

                        <form onSubmit={handleManualCodeSubmit} className="mt-8 flex gap-4">
                            <input
                                type="text"
                                placeholder="Enter 6-digit Access Code"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                                maxLength={6}
                            />
                            <Button type="submit" className="rounded-2xl px-6 bg-slate-900 border-none">GO</Button>
                        </form>

                        <div className="mt-8 flex items-center justify-center space-x-3 text-slate-400">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Surveillance Channel</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify by legal name or phone hash..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSearch} className="rounded-2xl bg-slate-900 border-none px-8 font-black tracking-widest uppercase text-xs">Analyze</Button>
                        <Button variant="ghost" className="rounded-2xl text-slate-400" onClick={() => { setSearchTerm(''); fetchVisitors(); }}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-2 mr-4">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Filter:</span>
                    </div>
                    {['GUEST', 'DELIVERY', 'CAB', 'MAID', 'VENDOR', 'SERVICE', 'OTHER'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleFilterByCategory(cat)}
                            className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border
                                ${filterCategory === cat
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                    : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    <button
                        onClick={() => handleFilterByCategory('')}
                        className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="flex space-x-8 border-b border-slate-100 px-2">
                <button
                    className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative
                        ${viewMode === 'active' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
                    `}
                    onClick={() => setViewMode('active')}
                >
                    <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4" />
                        <span>Live Premises ({visitors.filter(v => v.status === 'CHECKED_IN').length})</span>
                    </div>
                    {viewMode === 'active' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
                </button>
                <button
                    className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative
                        ${viewMode === 'history' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
                    `}
                    onClick={() => setViewMode('history')}
                >
                    <div className="flex items-center space-x-2">
                        <History className="w-4 h-4" />
                        <span>Manifest History</span>
                    </div>
                    {viewMode === 'history' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
                </button>
            </div>

            {showForm && (
                <AddVisitorForm
                    societyId={user?.societyId}
                    onSuccess={handleCheckInSuccess}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Records...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/30">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-50">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Identity</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Tag</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Surveillance Metadata</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">In/Out Manifest</th>
                                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {visitors.length === 0 && (
                                    <tr><td colSpan="7" className="px-10 py-24 text-center text-slate-300 font-bold italic italic">No active surveillance logs detected.</td></tr>
                                )}
                                {visitors.map(v => (
                                    <tr key={v.logId} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    {v.imageUrl ? (
                                                        <img
                                                            src={`http://localhost:8080${v.imageUrl}`}
                                                            alt={v.name}
                                                            className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-100 shadow-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                            <Camera className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    {v.status === 'CHECKED_IN' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>}
                                                </div>
                                                <div className="ml-5">
                                                    <div className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{v.name}</div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{v.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-2 bg-indigo-50 rounded-lg">
                                                    <ArrowUpRight className="w-3 h-3 text-indigo-500" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">Unit {v.flatNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                {v.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg w-fit">
                                                {v.vehicleNumber || 'BIO-ID ONLY'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <VisitorStatusBadge
                                                visitor={v}
                                                onUpdate={() => fetchVisitors()}
                                            />
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-[10px] font-black text-slate-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                                                    {v.inTime ? new Date(v.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                                                </div>
                                                <div className="flex items-center text-[10px] font-black text-slate-400">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></div>
                                                    {v.outTime ? new Date(v.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (
                                                        v.expectedOutTime && <span className="text-amber-500">EXP: {new Date(v.expectedOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap text-right">
                                            {!v.outTime && v.status !== 'PENDING' ? (
                                                <button
                                                    onClick={() => handleCheckout(v.logId)}
                                                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-rose-600 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-slate-200"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <div className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Protocol Terminated</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

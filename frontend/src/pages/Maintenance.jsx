import { useState, useEffect } from 'react';
import { billingService } from '../services/billingService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { CreditCard, CheckCircle, Clock, Receipt, TrendingUp, Filter, Download, ArrowUpRight } from 'lucide-react';
import { notify } from '../utils/alerts';

export default function Maintenance() {
    const { user } = useAuth();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGenerateForm, setShowGenerateForm] = useState(false);
    const [rate, setRate] = useState('');

    const isSecretary = user?.roles?.some(r => ['ROLE_RWA_SECRETARY', 'ROLE_ADMIN'].includes(r));

    const fetchBills = async () => {
        setLoading(true);
        try {
            const data = await billingService.getAllBills();
            setBills(data);
        } catch (error) {
            console.error("Failed to fetch bills", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await billingService.generateBills(parseFloat(rate));
            setShowGenerateForm(false);
            fetchBills();
            notify.success('Monthly maintenance ledger updated successfully!');
        } catch (error) {
            console.error("Failed to generate bills", error);
            notify.error('Billing cycle initiation failed.');
        }
    };

    const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingAmount = bills.filter(b => b.status !== 'PAID').reduce((sum, b) => sum + b.totalAmount, 0);

    return (
        <div className="space-y-10 fade-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Ledger</h2>
                    <p className="text-slate-500 mt-1">Manage maintenance billing and society collections</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 text-slate-600 font-bold px-5">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                    {isSecretary && (
                        <Button
                            onClick={() => setShowGenerateForm(!showGenerateForm)}
                            className="rounded-2xl bg-indigo-600 px-6 font-bold shadow-xl shadow-indigo-100"
                        >
                            {showGenerateForm ? 'Discard Draft' : 'Initiate Billing Cycle'}
                        </Button>
                    )}
                </div>
            </header>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12% vs last month</span>
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 text-right">Total Receivables</p>
                    <h3 className="text-3xl font-black text-slate-900 text-right">₹{totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <Clock className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-lg">High Priority</span>
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 text-right">Outstanding Dues</p>
                    <h3 className="text-3xl font-black text-slate-900 text-right">₹{pendingAmount.toLocaleString()}</h3>
                </div>

                <div className="bg-slate-950 p-6 rounded-[2rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600 rounded-full blur-[60px] opacity-40"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                <Receipt className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Invoices</p>
                            <h3 className="text-3xl font-black text-white">{bills.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {showGenerateForm && (
                <div className="scale-in bg-white p-8 rounded-[3rem] border-2 border-indigo-50 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                            <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">Billing Configuration</h3>
                            <p className="text-slate-400 text-sm font-medium">Set Maintenance Parameters</p>
                        </div>
                    </div>

                    <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-end gap-6 relative z-10">
                        <div className="flex-1 w-full">
                            <Input
                                label="Maintenance rate per square foot (₹)"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 3.50"
                                className="rounded-2xl border-slate-100 bg-slate-50 focus:bg-white h-14"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full md:w-auto px-10 h-14 rounded-2xl bg-indigo-600 font-black tracking-widest shadow-xl shadow-indigo-100">
                            GENERATE ALL INVOICES
                        </Button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/30">
                <header className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900 flex items-center">
                        Recent Invoices
                        <span className="ml-3 text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                            Live Feed
                        </span>
                    </h3>
                    <div className="flex gap-4">
                        <div className="hidden md:flex items-center bg-white rounded-xl px-4 py-2 border border-slate-100 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                            <TrendingUp className="w-3.5 h-3.5 text-slate-400 mr-2" />
                            <select className="bg-transparent text-xs font-bold text-slate-600 outline-none">
                                <option>All Status</option>
                                <option>Paid</option>
                                <option>Pending</option>
                            </select>
                        </div>
                        <button className="p-2 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="p-20 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {bills.length === 0 && (
                            <div className="py-20 text-center text-slate-400 font-bold">
                                No bill data available for the current selection.
                            </div>
                        )}
                        {bills.map(bill => (
                            <div key={bill.billId} className="px-10 py-6 hover:bg-slate-50 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 text-xl font-black transition-transform group-hover:scale-110
                                        ${bill.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600 outline-dashed outline-1 outline-offset-4 outline-orange-200'}
                                    `}>
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900 tracking-tight">Flat {bill.flatNumber}</h4>
                                        <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                            <Clock className="w-3 h-3 mr-1.5" />
                                            {new Date(bill.billMonth).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            <span className="mx-2 opacity-30">•</span>
                                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-10">
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-slate-900">₹{bill.totalAmount.toLocaleString()}</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest mt-1.5
                                            ${bill.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}
                                        `}>
                                            {bill.status === 'PAID' ? (
                                                <><CheckCircle className="w-3 h-3 mr-1.5" /> Settled</>
                                            ) : (
                                                <><Clock className="w-3 h-3 mr-1.5" /> Awaiting Payment</>
                                            )}
                                        </span>
                                    </div>
                                    <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 group-hover:translate-x-1 shadow-lg shadow-indigo-100/20">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

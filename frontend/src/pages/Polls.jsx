import { useEffect, useState } from 'react';
import { pollService } from '../services/pollService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { ShieldCheck, Vote, Users, PieChart, Timer, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

import { notify } from '../utils/alerts';

export default function Polls() {
    const { user } = useAuth();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const societyId = user?.societyId || 1;

    const fetchPolls = async () => {
        try {
            const data = await pollService.getActivePolls(societyId);
            setPolls(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, [societyId]);

    const handleVote = async (pollId, option) => {
        try {
            await pollService.vote(pollId, user.id, option);
            notify.success('Your voice has been recorded. Thank you!');
            fetchPolls();
        } catch (error) {
            notify.error(error.response?.data?.message || 'Vote failed. Please try again.');
        }
    };

    return (
        <div className="space-y-10 fade-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                        Collective Voice
                        <span className="ml-3 text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
                    </h2>
                    <p className="text-slate-500 mt-1">Shape the future of your society through democratic participation</p>
                </div>
                <div className="flex bg-white rounded-2xl p-1 border border-slate-100 shadow-sm">
                    <button className="px-6 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 transition-all">Active</button>
                    <button className="px-6 py-2 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:text-slate-600 transition-all">History</button>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[3rem] animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {polls.length === 0 && (
                        <div className="col-span-full py-32 text-center glass-card rounded-[3rem]">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
                                <PieChart className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Internal Consensus</h3>
                            <p className="text-slate-400 font-bold max-w-sm mx-auto text-sm">There are no active motions requiring a vote at this time. Check back soon for new community polls.</p>
                        </div>
                    )}
                    {polls.map((poll) => (
                        <article key={poll.pollId} className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 group flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <div className="flex items-center text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-2 rounded-xl border border-rose-100">
                                    <Timer className="w-3.5 h-3.5 mr-2" />
                                    Ends {new Date(poll.expiryDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 text-indigo-600 mb-6">
                                <Vote className="w-6 h-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Public Interest Motion</span>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-8 group-hover:text-indigo-600 transition-colors">
                                {poll.question}
                            </h3>

                            <div className="space-y-4 flex-1">
                                {poll.options ? poll.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleVote(poll.pollId, opt)}
                                        className="group/opt w-full flex items-center justify-between px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 relative overflow-hidden"
                                    >
                                        <span className="relative z-10 text-sm font-black text-slate-700 group-hover/opt:text-white transition-colors">{opt}</span>
                                        <div className="relative z-10 w-6 h-6 rounded-full border-2 border-slate-200 group-hover/opt:border-white/50 flex items-center justify-center transition-all">
                                            <div className="w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover/opt:opacity-100 transition-all scale-0 group-hover/opt:scale-100"></div>
                                        </div>
                                    </button>
                                )) : (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleVote(poll.pollId, "Yes")}
                                            className="flex-1 py-5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-100/20"
                                        >
                                            In Favor
                                        </button>
                                        <button
                                            onClick={() => handleVote(poll.pollId, "No")}
                                            className="flex-1 py-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-100/20"
                                        >
                                            Against
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex -space-x-3 overflow-hidden">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                            <Users className="w-3.5 h-3.5" />
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-indigo-50 text-indigo-600 text-[8px] font-black">
                                        +42
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    Total Participation: <span className="ml-2 text-indigo-600">84 Votes</span>
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Info Section */}
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex items-start space-x-6">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                            <ShieldCheck className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black mb-2">Encrypted Voting</h4>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Your vote is protected by advanced cryptographic protocols ensuring privacy and integrity.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-6">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black mb-2">Verified Outcomes</h4>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">All poll results are transparently audited by the RWA to ensure collective decisions are upheld.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-6">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                            <AlertCircle className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black mb-2">Democratic Rights</h4>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Every apartment carries a single weighted vote in society-wide legislative motions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

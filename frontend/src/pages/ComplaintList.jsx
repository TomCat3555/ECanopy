import { useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ComplaintForm from './ComplaintForm';
import { MessageSquare, X, ShieldAlert, CheckCircle2, Timer, Search, Filter, Send, User, ChevronRight, Plus } from 'lucide-react';
import { notify } from '../utils/alerts';

export default function ComplaintList() {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const isAdminOrRwa = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_PRESIDENT', 'ROLE_RWA_SECRETARY'].includes(r));

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            let data;
            if (isAdminOrRwa) {
                if (!user?.societyId) {
                    setError("Society information missing.");
                    return;
                }
                data = await complaintService.getAllComplaints(user.societyId);
            } else {
                data = await complaintService.getMyComplaints();
            }
            setComplaints(data);
        } catch (err) {
            setError('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [user]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await complaintService.updateStatus(id, newStatus);
            notify.success(`Status updated to ${newStatus.replace('_', ' ')}`);
            fetchComplaints();
        } catch (err) {
            notify.error("Failed to update status");
        }
    };

    const handleOpenConversation = async (complaint) => {
        setSelectedComplaint(complaint);
        setLoadingComments(true);
        try {
            const data = await complaintService.getComments(complaint.complaintId);
            setComments(data);
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await complaintService.addComment(selectedComplaint.complaintId, newComment);
            setNewComment('');
            const data = await complaintService.getComments(selectedComplaint.complaintId);
            setComments(data);
            notify.success('Reply sent');
        } catch (err) {
            notify.error("Failed to send reply");
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-rose-50 text-rose-600 border-rose-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'RESOLVED': return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
            case 'IN_PROGRESS': return <Timer className="w-3 h-3 mr-1.5" />;
            default: return <ShieldAlert className="w-3 h-3 mr-1.5" />;
        }
    };

    if (showForm) {
        return <ComplaintForm onSuccess={() => { setShowForm(false); fetchComplaints(); }} onCancel={() => setShowForm(false)} />;
    }

    return (
        <div className="space-y-8 fade-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {isAdminOrRwa ? 'Resident Grievances' : 'My Support Tickets'}
                    </h2>
                    <p className="text-slate-500 mt-1">Track and manage community issue resolutions</p>
                </div>
                <div className="flex gap-3">
                    <div className="hidden md:flex items-center bg-white rounded-2xl px-4 py-2 border border-slate-100 shadow-sm">
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <input type="text" placeholder="Search tickets..." className="bg-transparent text-sm font-medium outline-none text-slate-600 w-32 focus:w-48 transition-all" />
                    </div>
                    {!isAdminOrRwa && (
                        <Button
                            onClick={() => setShowForm(true)}
                            className="rounded-2xl bg-indigo-600 px-6 font-bold shadow-xl shadow-indigo-100"
                        >
                            Log New Issue
                        </Button>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[2.5rem] animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {complaints.length === 0 && (
                        <div className="col-span-full py-24 text-center glass-card rounded-[3rem]">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">System Tranquility</h3>
                            <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm">No active grievances reported. The community is operating smoothly.</p>
                        </div>
                    )}
                    {complaints.map((complaint, index) => (
                        <article
                            key={complaint.complaintId}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 group flex flex-col relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className={`flex items-center px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${getStatusStyles(complaint.status)}`}>
                                    {getStatusIcon(complaint.status)}
                                    {complaint.status}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                    {new Date(complaint.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>

                            <div className="flex-1 mb-6">
                                <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
                                    {complaint.title}
                                </h3>
                                {isAdminOrRwa && (
                                    <div className="flex items-center mb-3 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/50">
                                        <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white mr-2">
                                            {complaint.flatNumber ? complaint.flatNumber.slice(0, 1) : '?'}
                                        </div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                            {complaint.residentName} <span className="text-slate-400 mx-1">•</span> Flat {complaint.flatNumber}
                                        </p>
                                    </div>
                                )}
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 italic">"{complaint.description}"</p>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <button
                                    onClick={() => handleOpenConversation(complaint)}
                                    className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:translate-x-1 transition-transform relative pr-4"
                                >
                                    Discussion Hub
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                    {complaint.hasUnreadMessages && (
                                        <span className="absolute top-0 right-0 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </button>

                                {isAdminOrRwa && complaint.status !== 'RESOLVED' && (
                                    <div className="flex gap-2">
                                        {complaint.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleStatusUpdate(complaint.complaintId, 'IN_PROGRESS')}
                                                className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                                            >
                                                <Timer className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleStatusUpdate(complaint.complaintId, 'RESOLVED')}
                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-100"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Conversation Drawer-style Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 scale-in">
                    <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-white/20">
                        <header className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedComplaint.title}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        Ticket #{selectedComplaint.complaintId?.toString().padStart(4, '0')}
                                        <span className="mx-2 opacity-30">•</span>
                                        Status: {selectedComplaint.status}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedComplaint(null); fetchComplaints(); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                <Plus className="w-8 h-8 rotate-45" />
                            </button>
                        </header>

                        <div className="p-10 flex-1 overflow-y-auto space-y-6 bg-white custom-scrollbar">
                            <div className="bg-indigo-50/30 p-6 rounded-[2rem] border border-indigo-100/50 relative">
                                <div className="absolute top-4 left-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Description</div>
                                <p className="text-slate-600 text-sm italic font-medium pt-4 whitespace-pre-wrap leading-relaxed">
                                    "{selectedComplaint.description}"
                                </p>
                            </div>

                            <div className="space-y-6">
                                {loadingComments ? (
                                    <div className="space-y-4">
                                        <div className="h-10 bg-slate-50 rounded-xl animate-pulse w-2/3"></div>
                                        <div className="h-10 bg-slate-50 rounded-xl animate-pulse w-2/3 ml-auto"></div>
                                    </div>
                                ) : (
                                    comments.map(comment => {
                                        const isMe = comment.authorId === user.userId;
                                        return (
                                            <div key={comment.id} className={`flex flex-col ${!isMe ? 'items-start' : 'items-end'}`}>
                                                <div className={`max-w-[85%] p-5 rounded-2xl relative shadow-lg shadow-slate-100/50 ${!isMe ? 'bg-slate-50 text-slate-900 rounded-bl-none' : 'bg-indigo-600 text-white rounded-br-none'}`}>
                                                    <div className={`flex items-center mb-2 ${!isMe ? 'text-indigo-600' : 'text-indigo-200'}`}>
                                                        <User className="w-3 h-3 mr-1.5" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">
                                                            {isMe ? 'You' : comment.authorName} <span className="opacity-60 ml-1">({comment.authorRole})</span>
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-medium leading-relaxed">{comment.comment}</p>
                                                    <p className={`text-[9px] font-bold mt-2 text-right opacity-50`}>
                                                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                {comments.length === 0 && !loadingComments && (
                                    <div className="py-12 text-center text-slate-300 font-bold italic text-sm">
                                        No correspondence logged for this ticket yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <footer className="p-8 border-t border-slate-50 bg-slate-50/30">
                            <form onSubmit={handleSendReply} className="flex gap-4">
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-100 rounded-2xl h-14 pl-6 pr-12 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                        placeholder="Add a comment or internal note..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-xl shadow-indigo-100"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </form>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}

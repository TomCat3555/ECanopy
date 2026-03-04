import { useState, useEffect } from 'react';
import { noticeService } from '../services/noticeService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AlertCircle, Calendar, Megaphone, Plus, X, Info, Flame, ShieldAlert } from 'lucide-react';
import { notify } from '../utils/alerts';

export default function NoticeBoard() {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const isAdminOrRwa = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_PRESIDENT', 'ROLE_RWA_SECRETARY'].includes(r));
    const societyId = user?.societyId;

    const fetchNotices = async () => {
        try {
            const data = await noticeService.getNotices(societyId);
            setNotices(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'URGENT': return <Flame className="w-4 h-4" />;
            case 'HIGH': return <ShieldAlert className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-500/10 text-red-600 border-red-200';
            case 'HIGH': return 'bg-orange-500/10 text-orange-600 border-orange-200';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-200';
        }
    };

    return (
        <div className="space-y-8 fade-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community Notices</h2>
                    <p className="text-slate-500 mt-1">Stay updated with the latest society announcements</p>
                </div>
                {isAdminOrRwa && (
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded-2xl px-6 bg-indigo-600 flex items-center"
                    >
                        {showForm ? <X className="w-4 h-4 mr-2" /> : <Megaphone className="w-4 h-4 mr-2" />}
                        {showForm ? 'Close Editor' : 'Broadcast Notice'}
                    </Button>
                )}
            </header>

            {showForm && (
                <div className="scale-in">
                    <NoticeForm
                        societyId={societyId}
                        onSuccess={() => { setShowForm(false); fetchNotices(); }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {notices.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-card rounded-3xl">
                            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">The notice board is currently empty.</p>
                        </div>
                    )}
                    {notices.map((notice, index) => (
                        <article
                            key={notice.noticeId}
                            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 group relative overflow-hidden flex flex-col"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Decorative Type Badge */}
                            <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl opacity-60 group-hover:opacity-100 transition-opacity">
                                {notice.noticeType}
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <div className={`flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest ${getPriorityStyles(notice.priority)}`}>
                                    <span className="mr-2">{getPriorityIcon(notice.priority)}</span>
                                    {notice.priority}
                                </div>
                                <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                    {new Date(notice.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
                                    {notice.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                                    {notice.content}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600 mr-2 uppercase">
                                        RWA
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-indigo-600 font-black text-[10px] tracking-widest group-hover:translate-x-1 transition-transform">
                                    READ MORE
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

function NoticeForm({ societyId, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({ title: '', content: '', priority: 'MEDIUM', noticeType: 'GENERAL' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await noticeService.createNotice(societyId, formData);
            notify.success('Notice published successfully');
            onSuccess();
        } catch (err) {
            notify.error('Failed to post notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white p-8 rounded-[3rem] border-2 border-indigo-50 shadow-2xl relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <header className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                        <Megaphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Notice Editor</h3>
                        <p className="text-slate-400 text-sm font-medium">Broadcast to all residents</p>
                    </div>
                </div>
                <button onClick={onCancel} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Plus className="w-8 h-8 rotate-45" />
                </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Input
                            label="Announcement Title"
                            placeholder="e.g. Water Tank Cleaning"
                            className="rounded-2xl border-slate-100 bg-slate-50 focus:bg-white"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Urgency</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="LOW">Normal</option>
                                    <option value="MEDIUM">Important</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="URGENT">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                                    value={formData.noticeType}
                                    onChange={e => setFormData({ ...formData, noticeType: e.target.value })}
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="MEETING">Meeting</option>
                                    <option value="EVENT">Cultural Event</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-right">Message Details</label>
                        <textarea
                            placeholder="Write your announcement here..."
                            className="block w-full h-[168px] rounded-3xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-5 py-4 text-sm font-medium text-slate-700 outline-none transition-all resize-none"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-2xl bg-indigo-600 h-14 font-black tracking-widest shadow-xl shadow-indigo-100"
                    >
                        {loading ? 'BROADCASTING...' : 'PUBLISH NOTICE'}
                    </Button>
                </div>
            </form>
        </section>
    );
}

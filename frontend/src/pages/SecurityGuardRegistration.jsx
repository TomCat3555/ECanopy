import { useState } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { UserPlus } from 'lucide-react';
import { notify } from '../utils/alerts';

export default function SecurityGuardRegistration() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        societyId: user?.societyId || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!user?.societyId) {
            setError("Society ID missing. Please log out and log in again.");
            notify.error("Society ID missing.");
            setLoading(false);
            return;
        }

        try {
            await adminService.createSecurityGuard({
                ...formData,
                societyId: user.societyId
            });
            notify.success('Security Guard created successfully!');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                phoneNumber: '',
                societyId: user.societyId
            });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create security guard';
            setError(msg);
            notify.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10 fade-up">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
                <UserPlus className="mr-4 h-8 w-8 text-indigo-600" /> Register Security Guard
            </h1>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Guard Name"
                                className="block w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all border"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="guard@society.com"
                                className="block w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all border"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Access Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="block w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all border"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="+91 00000 00000"
                                className="block w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all border"
                            />
                        </div>
                    </div>

                    {error && <p className="text-rose-600 text-xs font-bold bg-rose-50 p-4 rounded-xl border border-rose-100 italic">{error}</p>}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="px-10 h-14 rounded-2xl bg-indigo-600 font-black tracking-widest shadow-xl shadow-indigo-100">
                            {loading ? 'ENROLLING...' : 'ENROLL GUARD'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

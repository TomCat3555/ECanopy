import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import Button from '../components/ui/Button';
import { Shield, User, Mail, Settings, UserPlus, Trash2, RefreshCcw, MoreHorizontal, ShieldCheck, Hammer } from 'lucide-react';
import { confirmAction, notify } from '../utils/alerts';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId, userName, role, action) => {
        const result = await confirmAction({
            title: 'Update Permissions?',
            text: `Are you sure you want to ${action === 'add' ? 'promote' : 'demote'} ${userName} to/from ${role.replace('ROLE_', '')}?`,
            confirmText: 'Yes, Confirm'
        });

        if (result.isConfirmed) {
            try {
                if (action === 'add') {
                    await adminService.updateUserRole(userId, role);
                } else {
                    await adminService.removeUserRole(userId, role);
                }
                notify.success('Role updated successfully');
                fetchUsers();
            } catch (err) {
                notify.error('Failed to update role');
            }
        }
    };

    return (
        <div className="space-y-10 fade-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ecosystem Directory</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage permissions and roles across the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUsers}
                        className="p-3.5 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-2xl border border-slate-100 shadow-sm active:rotate-180 duration-500"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-600 font-bold flex items-center">
                    <Trash2 className="w-5 h-5 mr-3" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Identity</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Communication</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Level</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(user => (
                                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-inner group-hover:scale-110 transition-transform">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{user.fullName}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">UID: {user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex items-center text-slate-500 font-medium">
                                            <Mail className="w-4 h-4 mr-2 opacity-40" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(user.roles).map(role => (
                                                <span key={role} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${role === 'ROLE_ADMIN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    role === 'ROLE_SUPER_ADMIN' ? 'bg-slate-900 text-white border-slate-900' :
                                                        'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                    {role.replace('ROLE_', '')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-3">
                                            {/* Secretary Toggle */}
                                            {user.roles.includes('ROLE_RWA_SECRETARY') ? (
                                                <button
                                                    onClick={() => handleRoleUpdate(user.id, user.fullName, 'RWA_SECRETARY', 'remove')}
                                                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Remove Secretary"
                                                >
                                                    <Hammer className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleUpdate(user.id, user.fullName, 'RWA_SECRETARY', 'add')}
                                                    className="p-3 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Make Secretary"
                                                >
                                                    <ShieldCheck className="w-5 h-5" />
                                                </button>
                                            )}

                                            {/* Security Toggle */}
                                            {user.roles.includes('ROLE_SECURITY_GUARD') ? (
                                                <button
                                                    onClick={() => handleRoleUpdate(user.id, user.fullName, 'SECURITY_GUARD', 'remove')}
                                                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Remove Guard Authority"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleUpdate(user.id, user.fullName, 'SECURITY_GUARD', 'add')}
                                                    className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Onboard as Security"
                                                >
                                                    <UserPlus className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {loading && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            )}
        </div>
    );
}

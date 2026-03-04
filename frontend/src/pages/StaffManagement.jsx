import { useEffect, useState } from 'react';
import { staffService } from '../services/staffService';
import { useAuth } from '../context/AuthContext';
import { confirmAction, notify } from '../utils/alerts';
import { Users, ShieldCheck, Phone, Clock, Trash2, Plus } from 'lucide-react';

export default function StaffManagement() {
    const { user } = useAuth();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, MY_HELP
    const [searchTerm, setSearchTerm] = useState('');
    const [showScanModal, setShowScanModal] = useState(false);
    const [scanCode, setScanCode] = useState('');

    const [newStaff, setNewStaff] = useState({
        name: '',
        helpType: 'MAID',
        phone: '',
        passCode: ''
    });

    const fetchStaff = async () => {
        try {
            const data = await staffService.getAllStaff();
            setStaffList(data);
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await staffService.addStaff(newStaff);
            setShowModal(false);
            setNewStaff({ name: '', helpType: 'MAID', phone: '', passCode: '' });
            notify.success('Staff added successfully');
            fetchStaff();
        } catch (error) {
            notify.error('Failed to add staff');
        }
    };

    const toggleLink = async (staff) => {
        const isLinked = staff.flats?.some(f => f.flatId === user.flatId);
        try {
            if (isLinked) {
                await staffService.unlinkStaffFromFlat(staff.helpId, user.flatId);
                notify.success(`Unlinked from ${staff.name}`);
            } else {
                await staffService.linkStaffToFlat(staff.helpId, user.flatId);
                notify.success(`Linked to ${staff.name}`);
            }
            fetchStaff();
        } catch (error) {
            notify.error('Operation failed');
        }
    };

    const handleScan = async (e) => {
        e.preventDefault();
        try {
            const result = await staffService.scanPassCode(scanCode);
            notify.success(`${result.type}: ${result.name} (${result.role})`);
            setShowScanModal(false);
            setScanCode('');
            fetchStaff();
        } catch (error) {
            notify.error(error.response?.data?.message || 'Invalid Passcode');
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmAction({
            title: 'Delete Staff?',
            text: 'Are you sure you want to remove this staff member?',
            confirmText: 'Yes, Delete',
            color: '#ef4444'
        });

        if (result.isConfirmed) {
            try {
                await staffService.deleteStaff(id);
                notify.success('Staff deleted');
                fetchStaff();
            } catch (error) {
                notify.error('Failed to delete');
            }
        }
    };

    if (loading) return <div>Loading staff...</div>;

    const isManager = user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_RWA_SECRETARY');
    const isGuard = user?.roles.includes('ROLE_SECURITY_GUARD');
    const isResident = user?.roles.includes('ROLE_RESIDENT');

    const filteredStaff = staffList.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone.includes(searchTerm) ||
            s.helpType.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'MY_HELP' && isResident) {
            return matchesSearch && s.flats?.some(f => f.flatId === user.flatId);
        }
        return matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Monitor society employees & personal help</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    {isGuard && (
                        <button
                            onClick={() => setShowScanModal(true)}
                            className="flex-1 md:flex-none flex items-center justify-center bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                        >
                            <ShieldCheck className="w-5 h-5 mr-2 text-indigo-400" />
                            Scan Entry/Exit
                        </button>
                    )}
                    {isManager && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex-1 md:flex-none flex items-center justify-center bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Staff
                        </button>
                    )}
                </div>
            </div>

            {/* Sub-header with Tabs & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/50 p-4 rounded-[2rem]">
                <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('ALL')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'ALL' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        DIRECTORY
                    </button>
                    {isResident && (
                        <button
                            onClick={() => setActiveTab('MY_HELP')}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'MY_HELP' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            MY HELP
                        </button>
                    )}
                </div>

                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search name, role or phone..."
                        className="w-full bg-white border-none p-4 pl-12 rounded-2xl shadow-sm text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                </div>
            </div>

            {filteredStaff.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-12 h-12 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">No matching staff found</h3>
                    <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStaff.map((staff) => {
                        const isLinked = staff.flats?.some(f => f.flatId === user.flatId);
                        return (
                            <div key={staff.helpId} className="group bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col relative">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center space-x-5">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-slate-200 group-hover:scale-105 transition-transform">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{staff.name}</h3>
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                {staff.helpType}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pass Code</p>
                                        <p className="text-md font-mono font-black text-indigo-600 px-3 py-1 bg-indigo-50/50 rounded-xl">
                                            {staff.passCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center text-slate-600 bg-slate-50 p-4 rounded-2xl mb-8">
                                    <Phone className="w-5 h-5 mr-3 text-indigo-500" />
                                    <span className="font-black text-lg">{staff.phone}</span>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                                    {isResident && (
                                        <button
                                            onClick={() => toggleLink(staff)}
                                            className={`flex-1 flex items-center justify-center p-4 rounded-2xl font-black transition-all h-14 ${isLinked
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white'
                                                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'
                                                }`}
                                        >
                                            {isLinked ? 'DISCONNECT' : 'HIRE / LINK'}
                                        </button>
                                    )}
                                    {isManager && (
                                        <button
                                            onClick={() => handleDelete(staff.helpId)}
                                            className="w-14 h-14 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all border border-slate-50"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Scan Modal */}
            {showScanModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-50">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-lg border border-slate-100 animate-in zoom-in duration-300">
                        <div className="bg-slate-900 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-slate-300">
                            <ShieldCheck className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 text-slate-900">Passcode Access</h2>
                        <p className="text-slate-500 mb-8 font-medium">Verify staff identity and record attendance.</p>

                        <form onSubmit={handleScan} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit Code"
                                    autoFocus
                                    maxLength={6}
                                    required
                                    className="w-full bg-slate-50 border-none p-6 rounded-3xl text-3xl text-center font-mono font-black tracking-[0.5em] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    value={scanCode}
                                    onChange={(e) => setScanCode(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setShowScanModal(false)} className="flex-1 px-8 py-5 text-slate-400 font-black hover:text-slate-600 transition-colors uppercase tracking-widest text-sm">Cancel</button>
                                <button type="submit" className="flex-[2] bg-indigo-600 text-white px-8 py-5 rounded-3xl font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-widest text-sm">Verify & Log</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Staff</h2>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                                <input
                                    type="text" placeholder="John Doe" required
                                    className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Role</label>
                                    <select
                                        className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={newStaff.helpType}
                                        onChange={(e) => setNewStaff({ ...newStaff, helpType: e.target.value })}
                                    >
                                        <option value="MAID">Maid</option>
                                        <option value="DRIVER">Driver</option>
                                        <option value="COOK">Cook</option>
                                        <option value="NANNY">Nanny</option>
                                        <option value="SECURITY">Security</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Phone</label>
                                    <input
                                        type="text" placeholder="10 Digits" required
                                        className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={newStaff.phone}
                                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Entry Code (Autogen if empty)</label>
                                <input
                                    type="text" placeholder="e.g. 123456"
                                    className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={newStaff.passCode}
                                    onChange={(e) => setNewStaff({ ...newStaff, passCode: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 font-semibold hover:text-gray-700 transition-colors">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 transition-all">Save Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import {
    Home,
    UserPlus,
    FileText,
    Bell,
    Users,
    Settings,
    Building2,
    CreditCard,
    ShieldCheck,
    Calendar,
    LogOut,
    Briefcase,
    HelpCircle,
    ShoppingBag
} from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            show: !user?.roles?.includes('ROLE_SECURITY_GUARD')
        },
        {
            name: 'Manage Users',
            href: '/dashboard/users',
            icon: Settings,
            show: user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_PRESIDENT', 'ROLE_RWA_SECRETARY'].includes(r))
        },
        {
            name: 'Membership',
            href: '/dashboard/membership',
            icon: UserPlus,
            show: user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_SECRETARY', 'ROLE_RWA_PRESIDENT'].includes(r))
        },
        {
            name: 'Complaints',
            href: '/dashboard/complaints',
            icon: FileText,
            show: !user?.roles?.includes('ROLE_SUPER_ADMIN') && !user?.roles?.includes('ROLE_SECURITY_GUARD')
        },
        {
            name: 'Notices',
            href: '/dashboard/notices',
            icon: Bell,
            show: !user?.roles?.includes('ROLE_SUPER_ADMIN') && !user?.roles?.includes('ROLE_SECURITY_GUARD')
        },
        {
            name: 'Maintenance',
            href: '/dashboard/maintenance',
            icon: CreditCard,
            show: user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RESIDENT', 'ROLE_RWA_SECRETARY'].includes(r))
        },
        {
            name: 'Amenities',
            href: '/dashboard/amenities',
            icon: Calendar,
            show: user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_SECRETARY', 'ROLE_RESIDENT'].includes(r))
        },
        {
            name: 'Marketplace',
            href: '/dashboard/marketplace',
            icon: ShoppingBag,
            show: !user?.roles?.includes('ROLE_SUPER_ADMIN') && !user?.roles?.includes('ROLE_SECURITY_GUARD')
        },
        {
            name: 'Visitors',
            href: '/dashboard/visitors',
            icon: Users,
            show: user?.roles?.some(r => ['ROLE_SECURITY_GUARD', 'ROLE_ADMIN', 'ROLE_RWA_PRESIDENT', 'ROLE_RWA_SECRETARY'].includes(r))
        },
        {
            name: 'Staff Management',
            href: '/dashboard/staff',
            icon: Briefcase,
            show: !user?.roles?.includes('ROLE_SUPER_ADMIN')
        },
        {
            name: 'My Visitors',
            href: '/dashboard/my-visitors',
            icon: ShieldCheck,
            show: user?.roles?.includes('ROLE_RESIDENT')
        },
        {
            name: 'Manage Societies',
            href: '/dashboard/society-setup',
            icon: Building2,
            show: user?.roles?.includes('ROLE_SUPER_ADMIN')
        },
        {
            name: 'Guard Registration',
            href: '/dashboard/register-guard',
            icon: UserPlus,
            show: user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_SECRETARY'].includes(r))
        },
    ];

    return (
        <div className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-white/5 h-screen sticky top-0 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-24 -right-24 w-48 h-48 bg-cyan-600 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative flex flex-col h-full z-10">
                {/* Brand */}
                <div className="px-8 flex items-center h-24">
                    <div className="bg-indigo-600 p-2.5 rounded-2xl mr-3 shadow-lg shadow-indigo-600/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">
                        ECanopy<span className="text-indigo-500 text-3xl leading-none">.</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
                    {navigation.filter(item => item.show).map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    'group flex items-center px-4 py-3 text-sm font-semibold rounded-2xl relative',
                                    isActive
                                        ? 'bg-white/10 text-white translate-x-1 outline-none'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-full -ml-3 shadow-[0_0_15px_rgba(79,70,229,1)]"></div>
                                )}
                                <item.icon
                                    className={cn(
                                        'mr-3.5 h-5 w-5 flex-shrink-0',
                                        isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 mx-4 mb-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center mb-4">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-black text-white shadow-lg">
                                {user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-slate-950 rounded-full"></div>
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-black text-white leading-tight">{user?.fullName}</p>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-60">
                                {user?.roles?.[0]?.replace('ROLE_', '') || 'User'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white group"
                    >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
}

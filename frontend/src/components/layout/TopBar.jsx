import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Menu, Command, Sparkles } from 'lucide-react';

export default function TopBar() {
    const location = useLocation();
    const { user } = useAuth();

    const getHeading = () => {
        const path = location.pathname.split('/').pop() || 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    };

    return (
        <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-white/40 backdrop-blur-3xl border-b border-slate-100/50">
            <div className="flex items-center gap-8">
                <button className="lg:hidden p-3 text-slate-900 border border-slate-200 rounded-2xl hover:bg-white transition-all active:scale-95 shadow-sm">
                    <Menu className="w-5 h-5" />
                </button>

                <div className="hidden lg:flex items-center gap-3">
                    <div className="bg-indigo-600/10 p-2 rounded-xl">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase text-[12px] opacity-40 mb-1">Navigation</h2>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{getHeading()}</h1>
                    </div>
                </div>

                <div className="hidden xl:flex items-center bg-white/60 border border-slate-200/60 rounded-2xl px-6 py-2.5 group focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all w-[400px] shadow-sm">
                    <Search className="w-4 h-4 text-slate-400 mr-4 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search... (Alt + S)"
                        className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-400 placeholder:font-medium"
                    />
                    <div className="flex items-center gap-1.5 ml-4">
                        <kbd className="px-2 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-lg border border-slate-200">ALT</kbd>
                        <kbd className="px-2 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-lg border border-slate-200">S</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <button className="relative p-3.5 text-slate-600 hover:text-indigo-600 transition-all hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl group active:scale-90">
                        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-3.5 right-3.5 h-2.5 w-2.5 bg-indigo-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
                    </button>

                    <button className="p-3.5 text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 rounded-2xl group active:scale-90">
                        <Command className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-slate-200/50 hidden sm:block"></div>

                <div className="flex items-center gap-4 bg-white/20 p-1.5 pr-6 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-xl shadow-indigo-600/20 ring-4 ring-white">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <p className="text-sm font-black text-slate-900 leading-tight">{user?.fullName}</p>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-60">
                            {user?.roles?.[0]?.replace('ROLE_', '') || 'User'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user?.roles?.includes('ROLE_SECURITY_GUARD')) {
                navigate('/dashboard/visitors');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('The credentials provided do not match our records.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 overflow-hidden font-inter">
            {/* Left Side: Visual/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-3/5 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
                {/* Abstract Decorative Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[140px] opacity-20 -mr-96 -mt-96"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600 rounded-full blur-[120px] opacity-10 -ml-48 -mb-48"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                <div className="relative z-10 w-full max-w-2xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="bg-indigo-600 p-4 rounded-[2rem] shadow-2xl shadow-indigo-600/20">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-5xl font-black text-white tracking-tighter">ECanopy<span className="text-indigo-500">.</span></span>
                    </div>

                    <h1 className="text-6xl font-black text-white tracking-tight leading-[1.1] mb-8">
                        The future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Society Management</span> is here.
                    </h1>

                    <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12 max-w-lg">
                        Secure, seamless, and sophisticated. Join 500+ premium communities managing their life with ECanopy.
                    </p>

                    <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/5">
                        <div>
                            <p className="text-white text-3xl font-black mb-1">99.9%</p>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Security Uptime</p>
                        </div>
                        <div>
                            <p className="text-white text-3xl font-black mb-1">2.5k+</p>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Daily Visitors</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-12 md:p-20 bg-white relative">
                <div className="w-full max-w-sm">
                    <header className="mb-12">
                        <div className="lg:hidden flex items-center mb-8">
                            <div className="bg-indigo-600 p-2 rounded-xl mr-3">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black text-slate-950 tracking-tighter">ECanopy</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-950 tracking-tight mb-3">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to access your dashboard.</p>
                    </header>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="relative group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@society.com"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] pl-12 pr-4 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] pl-12 pr-4 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 flex items-center">
                                <Sparkles className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center bg-indigo-600 h-16 rounded-[1.25rem] text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all group disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'LOGGING IN...' : (
                                    <>
                                        LOGIN
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-8 border-t border-slate-50">
                            <span className="text-slate-400 text-sm font-medium mr-1.5">New to the community?</span>
                            <Link to="/register" className="text-sm font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-2">
                                Request Access
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

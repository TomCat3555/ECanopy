import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ShieldCheck, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 flex items-center space-x-3">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-600/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-3xl font-black text-white tracking-tighter italic">ECanopy.</span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-6xl font-black text-white leading-tight tracking-tighter mb-8">
                        Join the <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Next Gen</span> <br />
                        Community.
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-md italic opacity-80 leading-relaxed">
                        "Your home is part of a larger ecosystem. We provide the intelligence to manage it seamlessly."
                    </p>
                </div>

                <div className="relative z-10 flex items-center space-x-8">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">10,000+ Verified Residents</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-slate-50/50">
                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign Up</h2>
                        <p className="text-slate-500 font-medium">Set up your global profile to access societies.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                name="fullName"
                                type="text"
                                placeholder="John Doe"
                                icon={<User className="w-4 h-4" />}
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                variant="modern"
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                icon={<Mail className="w-4 h-4" />}
                                required
                                value={formData.email}
                                onChange={handleChange}
                                variant="modern"
                            />
                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                placeholder="+91 98765 43210"
                                icon={<Phone className="w-4 h-4" />}
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                variant="modern"
                            />
                            <Input
                                label="Create Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="w-4 h-4" />}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                variant="modern"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 text-sm font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            className="h-16 rounded-[1.5rem] bg-slate-900 text-white font-black tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
                        >
                            <span className="flex items-center justify-center space-x-3">
                                <span>{loading ? 'LOADING...' : 'REGISTER'}</span>
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </span>
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-slate-500 font-medium">
                            Already part of a community?{' '}
                            <Link to="/login" className="font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="pt-10 border-t border-slate-200 flex justify-between items-center opacity-40 grayscale">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Encrypted</span>
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

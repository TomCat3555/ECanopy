import { useState } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    {message && <div className="text-green-600 text-sm text-center">{message}</div>}
                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                    <div>
                        <Button type="submit" className="w-full">
                            Send Reset Link
                        </Button>
                    </div>
                    <div className="text-center">
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

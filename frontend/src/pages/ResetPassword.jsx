import { useState } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await api.post('/auth/reset-password', { token, newPassword });
            setMessage(response.data);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />

                    {message && <div className="text-green-600 text-sm text-center">{message}</div>}
                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                    <div>
                        <Button type="submit" className="w-full">
                            Reset Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

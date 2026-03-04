import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
    const { user } = useAuth();
    const location = useLocation();

    // Check if user is a standard resident who hasn't joined a society yet
    const isSuperAdmin = user?.roles?.includes('ROLE_SUPER_ADMIN');
    const isSecurityGuard = user?.roles?.includes('ROLE_SECURITY_GUARD');
    const needsOnboarding = !isSuperAdmin && !isSecurityGuard && !user?.societyId;

    // Redirect to dashboard if trying to access other pages during onboarding
    if (needsOnboarding && location.pathname !== '/dashboard') {
        return <Navigate to="/dashboard" replace />;
    }

    if (needsOnboarding) {
        return (
            <div className="min-h-screen bg-slate-50">
                <main className="min-h-screen scrollbar-elegant">
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-auto p-6 scrollbar-elegant">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

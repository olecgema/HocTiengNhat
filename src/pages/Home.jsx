import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
    const { session, loading } = useAuth();

    if (loading) {
        return <div className="app-container"><p>Đang tải...</p></div>;
    }

    // Redirect to dashboard if logged in, otherwise to login
    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
}

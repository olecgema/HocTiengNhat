import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthLayout() {
    const { session, loading } = useAuth();

    if (loading) {
        return <div className="app-container"><p>Đang tải...</p></div>;
    }

    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1><i className="fa-solid fa-language"></i> Vũ Học Tiếng Nhật </h1>
                <p className="subtitle">Nắm vững Hiragana và Katakana</p>
            </header>
            <Outlet />
            <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <Link to="/privacy-policy" className="btn-text" style={{ fontSize: '0.85rem' }}>Privacy Policy</Link>
                <Link to="/terms-of-service" className="btn-text" style={{ fontSize: '0.85rem' }}>Terms of Service</Link>
            </div>
        </div>
    );
}

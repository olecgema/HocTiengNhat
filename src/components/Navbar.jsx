import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Button from './Button';

export default function Navbar() {
    const { session, user } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        await authService.logout();
    };

    return (
        <>
            <header className="app-header">
                <h1><i className="fa-solid fa-language"></i> Vũ Học Tiếng Nhật </h1>
                <p className="subtitle">Nắm vững Hiragana và Katakana</p>
                {session && (
                    <nav className="main-nav">
                        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                            <i className="fa-solid fa-font"></i> Bảng Chữ Cái
                        </Link>
                        <Link to="/phrases" className={`nav-link ${location.pathname === '/phrases' ? 'active' : ''}`}>
                            <i className="fa-solid fa-book"></i> Câu & Từ Vựng
                        </Link>
                    </nav>
                )}
            </header>

            {session && (
                <div className="user-info-banner">
                    <i className="fa-solid fa-user"></i>
                    <span>Xin chào, <strong>{user?.email}</strong></span>
                    <Button onClick={handleLogout} className="btn-logout">
                        Đăng xuất
                    </Button>
                </div>
            )}
        </>
    );
}

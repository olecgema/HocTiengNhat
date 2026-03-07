import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Button from './Button';

export default function Navbar() {
    const { session, user } = useAuth();

    const handleLogout = async () => {
        await authService.logout();
    };

    return (
        <>
            <header className="app-header">
                <h1><i className="fa-solid fa-language"></i> Vũ Học Tiếng Nhật </h1>
                <p className="subtitle">Nắm vững Hiragana và Katakana</p>
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

import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { unlockAudio } from '../utils/helpers';

export default function MainLayout() {
    const { session, loading } = useAuth();
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    const handleUnlockAudio = () => {
        unlockAudio();
        setAudioUnlocked(true);
    };

    if (loading) {
        return <div className="app-container"><p>Đang tải...</p></div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-container">
            <Navbar />

            {!audioUnlocked && (
                <button className="audio-unlock-banner" onClick={handleUnlockAudio}>
                    <i className="fa-solid fa-volume-xmark"></i>
                    <span>Nhấn để bật âm thanh</span>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            )}

            <Outlet />

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/privacy-policy" className="btn-text" style={{ fontSize: '0.85rem' }}>Privacy Policy</Link>
            </div>
        </div>
    );
}

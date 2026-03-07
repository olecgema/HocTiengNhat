import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await authService.login(email, password);
            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <h2>Đăng nhập</h2>
                <p className="auth-subtitle">Chào mừng bạn quay lại!</p>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <div className={`auth-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" className="btn-auth" disabled={loading || !email || !password}>
                        {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...</> : 'Đăng nhập ngay'}
                    </Button>
                </form>

                <div className="auth-switch">
                    <p>
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="btn-text">Đăng ký ngay</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}

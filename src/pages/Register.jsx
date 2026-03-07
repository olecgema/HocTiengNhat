import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await authService.register(email, password);
            if (error) throw error;
            setMessage({ type: 'success', text: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận (nếu có yêu cầu).' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <h2>Tạo tài khoản</h2>
                <p className="auth-subtitle">Bắt đầu hành trình chinh phục tiếng Nhật.</p>

                <form onSubmit={handleRegister} className="auth-form">
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
                            placeholder="Tạo mật khẩu"
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
                        {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...</> : 'Đăng ký'}
                    </Button>
                </form>

                <div className="auth-switch">
                    <p>
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="btn-text">Đăng nhập</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../index.css';

export default function Auth({ session }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận (nếu có yêu cầu).' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <h2>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Chào mừng bạn quay lại!' : 'Bắt đầu hành trình chinh phục tiếng Nhật.'}
                </p>

                <form onSubmit={handleAuth} className="auth-form">
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

                    <button
                        type="submit"
                        className="btn btn-primary btn-auth"
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...</>
                        ) : (
                            isLogin ? 'Đăng nhập ngay' : 'Đăng ký'
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                        <button
                            type="button"
                            className="btn-text"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage(null);
                            }}
                        >
                            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

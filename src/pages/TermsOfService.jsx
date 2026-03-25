import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function TermsOfService() {
    return (
        <div className="app-container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <Link to="/" className="btn-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', textDecoration: 'none' }}>
                <i className="fa-solid fa-arrow-left"></i> Quay về trang chủ
            </Link>

            <Card className="glass-card">
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--primary-light)' }}>Terms of Service</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Last updated: March 25, 2026</p>

                <div style={{ lineHeight: '1.8', color: 'var(--text-main)' }}>
                    <p style={{ marginBottom: '15px' }}>
                        Welcome to our application. Please read these Terms of Service completely before using our Service.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>1. Acceptance of Terms</h2>
                    <p style={{ marginBottom: '15px' }}>
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>2. Use of Service</h2>
                    <p style={{ marginBottom: '15px' }}>
                        You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>3. Intellectual Property</h2>
                    <p style={{ marginBottom: '15px' }}>
                        The Service and its original content, features and functionality are and will remain the exclusive property of the Company and its licensors.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>4. Termination</h2>
                    <p style={{ marginBottom: '15px' }}>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>5. Governing Law</h2>
                    <p style={{ marginBottom: '15px' }}>
                        These Terms shall be governed and construed in accordance with the laws of Vietnam, without regard to its conflict of law provisions.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>6. Changes</h2>
                    <p style={{ marginBottom: '15px' }}>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. We will let you know via email and/or a prominent notice on our Service prior to the change becoming effective.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>Contact Us</h2>
                    <p style={{ marginBottom: '15px' }}>If you have any questions about these Terms, please contact us:</p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '10px' }}>By email: tamtrangnb@gmail.com</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}

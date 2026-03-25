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
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Hoc Tieng Nhat website and application (the "Service") operated by us.
                    </p>
                    <p style={{ marginBottom: '25px' }}>
                        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>1. Acceptance of Terms</h2>
                    <p style={{ marginBottom: '15px' }}>
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>2. Accounts</h2>
                    <p style={{ marginBottom: '15px' }}>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                    </p>
                    <p style={{ marginBottom: '25px' }}>
                        You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>3. Intellectual Property</h2>
                    <p style={{ marginBottom: '25px' }}>
                        The Service and its original content, features and functionality are and will remain the exclusive property of our Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the country and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of our Company.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>4. Links To Other Web Sites</h2>
                    <p style={{ marginBottom: '15px' }}>
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by our Company.
                    </p>
                    <p style={{ marginBottom: '25px' }}>
                        Our Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that our Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>5. Termination</h2>
                    <p style={{ marginBottom: '15px' }}>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                    <p style={{ marginBottom: '25px' }}>
                        Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>6. Limitation Of Liability</h2>
                    <p style={{ marginBottom: '25px' }}>
                        In no event shall our Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>7. Disclaimer</h2>
                    <p style={{ marginBottom: '25px' }}>
                        Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>8. Governing Law</h2>
                    <p style={{ marginBottom: '25px' }}>
                        These Terms shall be governed and construed in accordance with the laws of Vietnam, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>9. Changes</h2>
                    <p style={{ marginBottom: '15px' }}>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p style={{ marginBottom: '25px' }}>
                        By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                    </p>

                    <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>10. Contact Us</h2>
                    <p style={{ marginBottom: '15px' }}>If you have any questions about these Terms, please contact us:</p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '10px' }}>By email: tamtrangnb@gmail.com</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}

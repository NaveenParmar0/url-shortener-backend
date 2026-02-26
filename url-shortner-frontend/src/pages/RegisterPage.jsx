import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, CheckCircle, Zap } from 'lucide-react';
import './AuthPages.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registerUser(form);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-orb auth-orb-1" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35), transparent 70%)' }} />
                <div className="auth-orb auth-orb-2" style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2), transparent 70%)' }} />
            </div>

            <div className="auth-container">
                <div className="auth-card card animate-fadeInUp">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <div className="brand-icon">
                                <Zap size={16} />
                            </div>
                            <span className="brand-name">Linklytics</span>
                        </Link>
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-subtitle">Start shortening and tracking your links for free</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="alert alert-error">
                                <Lock size={15} /> {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success">
                                <CheckCircle size={15} /> Account created! Redirecting to login...
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <div className="input-with-icon">
                                <User className="input-icon" size={16} />
                                <input
                                    type="text"
                                    name="username"
                                    className="input-field input-with-icon-field"
                                    placeholder="Choose a username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-with-icon">
                                <Mail className="input-icon" size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    className="input-field input-with-icon-field"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-with-icon">
                                <Lock className="input-icon" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="input-field input-with-icon-field"
                                    placeholder="Create a strong password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="input-eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading || success}>
                            {loading ? (
                                <><span className="spinner" />&nbsp;Creating account...</>
                            ) : (
                                <><UserPlus size={16} /> Create Account</>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

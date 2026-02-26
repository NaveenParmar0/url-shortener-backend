import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { loginUser } from '../api';
import { LogIn, Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import './AuthPages.css';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await loginUser(form);
            const token = res.data.token || res.data.jwtToken || res.data;
            login(token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-orb auth-orb-1" />
                <div className="auth-orb auth-orb-2" />
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
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to manage your links & analytics</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="alert alert-error">
                                <Lock size={15} /> {error}
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <div className="input-with-icon">
                                <Mail className="input-icon" size={16} />
                                <input
                                    type="text"
                                    name="username"
                                    className="input-field input-with-icon-field"
                                    placeholder="Enter your username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
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
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
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

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? (
                                <><span className="spinner" />&nbsp;Signing in...</>
                            ) : (
                                <><LogIn size={16} /> Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register" className="auth-link">Create one free</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

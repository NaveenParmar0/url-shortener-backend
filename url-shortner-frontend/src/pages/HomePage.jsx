import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { shortenUrl } from '../api';
import {
    Link2, Zap, BarChart3, Shield, Copy, Check,
    ArrowRight, Globe, TrendingUp, Lock, ChevronRight
} from 'lucide-react';
import './HomePage.css';

const FEATURES = [
    {
        icon: <Zap size={22} />,
        title: 'Instant Shortening',
        desc: 'Transform any long URL into a clean, concise link in milliseconds.',
        color: '#6366f1',
    },
    {
        icon: <BarChart3 size={22} />,
        title: 'Deep Analytics',
        desc: 'Track clicks, geographic data, and referral sources in real-time.',
        color: '#8b5cf6',
    },
    {
        icon: <Shield size={22} />,
        title: 'Enterprise Security',
        desc: 'JWT-secured endpoints with BCrypt encrypted credentials.',
        color: '#06b6d4',
    },
    {
        icon: <Globe size={22} />,
        title: 'Global Reach',
        desc: 'Fast redirects powered by a high-performance Spring Boot backend.',
        color: '#10b981',
    },
];

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const inputRef = useRef();

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await shortenUrl(url.trim());
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to shorten URL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        const shortLink = `http://localhost:8080/${result.shortUrl}`;
        await navigator.clipboard.writeText(shortLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero-section">
                <div className="hero-bg-effects">
                    <div className="hero-orb hero-orb-1" />
                    <div className="hero-orb hero-orb-2" />
                    <div className="hero-orb hero-orb-3" />
                </div>
                <div className="container hero-content">
                    <div className="hero-badge animate-fadeInUp">
                        <span className="hero-badge-dot" />
                        <span>Powered by Spring Boot + React</span>
                    </div>
                    <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        Shorten Links.<br />
                        <span className="gradient-text">Amplify Impact.</span>
                    </h1>
                    <p className="hero-desc animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        Linklytics turns any long URL into a powerful, trackable short link.
                        Monitor clicks, analyze traffic, and share confidently.
                    </p>

                    {/* URL Input */}
                    <form onSubmit={handleShorten} className="url-form animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <div className="url-input-wrapper">
                            <Link2 className="url-input-icon" size={18} />
                            <input
                                ref={inputRef}
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste your long URL here..."
                                className="url-input"
                                required
                            />
                            <button type="submit" className="btn btn-primary url-submit" disabled={loading}>
                                {loading ? <span className="spinner" /> : <><Zap size={16} /> Shorten</>}
                            </button>
                        </div>
                        {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}
                    </form>

                    {result && (
                        <div className="result-card animate-fadeInUp">
                            <div className="result-label">Your shortened link is ready! 🎉</div>
                            <div className="result-link-row">
                                <a
                                    href={`http://localhost:8080/${result.shortUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="result-link"
                                >
                                    linklytics.io/{result.shortUrl}
                                </a>
                                <button className="btn btn-sm btn-ghost" onClick={handleCopy}>
                                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                                </button>
                            </div>
                            <div className="result-original">
                                Original: <span>{result.originalUrl}</span>
                            </div>
                        </div>
                    )}

                    <div className="hero-ctas animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                <BarChart3 size={18} />
                                Go to Dashboard
                                <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="btn btn-outline btn-lg">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar">
                <div className="container stats-inner">
                    {[
                        { value: '10K+', label: 'Links Created' },
                        { value: '99.9%', label: 'Uptime' },
                        { value: '50+', label: 'Countries Tracked' },
                        { value: '< 50ms', label: 'Redirect Speed' },
                    ].map((stat) => (
                        <div key={stat.label} className="stats-item">
                            <div className="stats-value">{stat.value}</div>
                            <div className="stats-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Everything You Need</h2>
                        <p className="section-desc">
                            A complete URL management platform with powerful features built in.
                        </p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <div key={f.title} className="feature-card card animate-fadeInUp" style={{ animationDelay: `${0.1 * i}s` }}>
                                <div className="feature-icon" style={{ background: `${f.color}20`, color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-glow" />
                        <div className="cta-content">
                            <h2>Ready to shorten smarter?</h2>
                            <p>Join thousands of users managing their links with Linklytics.</p>
                            <div className="cta-actions">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Create Free Account <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-inner">
                    <div className="footer-brand">
                        <div className="brand-icon" style={{ width: 30, height: 30 }}>
                            <Zap size={14} />
                        </div>
                        <span className="brand-name" style={{ fontSize: 16 }}>Linklytics</span>
                    </div>
                    <p className="footer-copy">© 2025 Linklytics. Built with Spring Boot & React.</p>
                </div>
            </footer>
        </div>
    );
}

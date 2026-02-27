import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getMyUrls, shortenUrl } from '../api';
import {
    Link2, Plus, Copy, Check, ExternalLink, BarChart2,
    Calendar, MousePointerClick, Search, Zap, RefreshCw
} from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUrl, setNewUrl] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        else fetchUrls();
    }, [isAuthenticated]);

    const fetchUrls = async () => {
        setLoading(true);
        try {
            const res = await getMyUrls();
            setUrls(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newUrl.trim()) return;
        setCreating(true);
        setCreateError('');
        try {
            const res = await shortenUrl(newUrl.trim());
            setUrls([res.data, ...urls]);
            setNewUrl('');
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Failed to create short URL.');
        } finally {
            setCreating(false);
        }
    };

    const handleCopy = async (url, id) => {
        await navigator.clipboard.writeText(`https://url-shortener-backend-ikye.onrender.com/${url.shortUrl}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const totalClicks = urls.reduce((s, u) => s + u.clickCount, 0);
    const filtered = urls.filter(u =>
        u.shortUrl?.toLowerCase().includes(search.toLowerCase()) ||
        u.originalUrl?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header animate-fadeInUp">
                    <div>
                        <h1 className="dashboard-title">
                            Good day, <span className="gradient-text">{user?.username}</span> 👋
                        </h1>
                        <p className="dashboard-subtitle">Manage all your short links in one place.</p>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={fetchUrls}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Stats Row */}
                <div className="stats-row animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="card stat-card-item">
                        <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                            <Link2 size={22} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{urls.length}</div>
                            <div className="stat-label">Total Links</div>
                        </div>
                    </div>
                    <div className="card stat-card-item">
                        <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                            <MousePointerClick size={22} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{totalClicks}</div>
                            <div className="stat-label">Total Clicks</div>
                        </div>
                    </div>
                    <div className="card stat-card-item">
                        <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                            <Zap size={22} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">
                                {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
                            </div>
                            <div className="stat-label">Avg Clicks/Link</div>
                        </div>
                    </div>
                </div>

                {/* Create Form */}
                <div className="card create-form-card animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                    <h2 className="create-form-title">
                        <Plus size={18} /> Shorten a New URL
                    </h2>
                    <form onSubmit={handleCreate} className="create-form">
                        <div className="create-input-wrap">
                            <Link2 className="create-input-icon" size={16} />
                            <input
                                type="url"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="Paste a long URL to shorten..."
                                className="input-field create-input"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary create-submit" disabled={creating}>
                            {creating ? <span className="spinner" /> : <><Zap size={15} /> Create Link</>}
                        </button>
                    </form>
                    {createError && <div className="alert alert-error" style={{ marginTop: 12 }}>{createError}</div>}
                </div>

                {/* URL List */}
                <div className="url-list-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="url-list-header">
                        <h2 className="url-list-title">Your Links <span className="badge badge-primary">{urls.length}</span></h2>
                        <div className="search-wrap">
                            <Search size={15} className="search-icon" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search links..."
                                className="search-input"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                            <p>Loading your links...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><Link2 size={40} /></div>
                            <h3>No links yet</h3>
                            <p>Shorten your first URL above to get started!</p>
                        </div>
                    ) : (
                        <div className="url-grid">
                            {filtered.map((url, i) => (
                                <div key={url.id} className="url-card card animate-fadeInUp" style={{ animationDelay: `${0.05 * i}s` }}>
                                    <div className="url-card-header">
                                        <a
                                            href={`https://url-shortener-backend-ikye.onrender.com/${url.shortUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="url-short-link"
                                        >
                                            <Zap size={12} />
                                            linklytics.io/{url.shortUrl}
                                            <ExternalLink size={12} />
                                        </a>
                                        <div className="url-click-badge">
                                            <MousePointerClick size={12} />
                                            {url.clickCount}
                                        </div>
                                    </div>

                                    <p className="url-original" title={url.originalUrl}>
                                        {url.originalUrl}
                                    </p>

                                    <div className="url-meta">
                                        <span className="url-date">
                                            <Calendar size={12} />
                                            {new Date(url.createdDate).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="url-actions">
                                        <button
                                            className={`btn btn-sm ${copiedId === url.id ? 'btn-ghost' : 'btn-outline'}`}
                                            onClick={() => handleCopy(url, url.id)}
                                            style={{ flex: 1 }}
                                        >
                                            {copiedId === url.id ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                                        </button>
                                        <Link
                                            to={`/analytics/${url.shortUrl}`}
                                            className="btn btn-sm btn-ghost"
                                            style={{ flex: 1 }}
                                        >
                                            <BarChart2 size={13} /> Analytics
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

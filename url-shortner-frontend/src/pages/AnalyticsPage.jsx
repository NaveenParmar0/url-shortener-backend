import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getUrlAnalytics, getTotalClicks, getMyUrls } from '../api';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
    ArrowLeft, BarChart2, MousePointerClick, Calendar,
    TrendingUp, Activity, Link2
} from 'lucide-react';
import './AnalyticsPage.css';

const fmt = (date) => date.toISOString().replace('T', 'T').split('.')[0];

const toLocalISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function AnalyticsPage() {
    const { shortUrl } = useParams();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [clickData, setClickData] = useState([]);
    const [totalData, setTotalData] = useState([]);
    const [urlInfo, setUrlInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Date range: last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        loadData();
    }, [shortUrl, isAuthenticated]);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const startISO = `${fmt(start)}`;
            const endISO = `${fmt(end)}`;

            const [analyticsRes, totalRes, urlsRes] = await Promise.all([
                getUrlAnalytics(shortUrl, startISO, endISO),
                getTotalClicks(toLocalISO(start), toLocalISO(end)),
                getMyUrls(),
            ]);

            setClickData(analyticsRes.data.map(item => ({
                date: item.clickDate,
                clicks: item.count,
            })));

            setTotalData(
                Object.entries(totalRes.data)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, count]) => ({ date, clicks: count }))
            );

            const found = urlsRes.data.find(u => u.shortUrl === shortUrl);
            setUrlInfo(found || null);
        } catch (err) {
            setError('Failed to load analytics. Make sure you own this link.');
        } finally {
            setLoading(false);
        }
    };

    const totalClicks = clickData.reduce((s, d) => s + Number(d.clicks), 0);
    const maxClicks = clickData.length > 0 ? Math.max(...clickData.map(d => Number(d.clicks))) : 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="chart-tooltip">
                    <p className="tooltip-date">{label}</p>
                    <p className="tooltip-value"><MousePointerClick size={13} /> {payload[0].value} clicks</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="analytics-page">
            <div className="container">
                {/* Header */}
                <div className="analytics-header animate-fadeInUp">
                    <Link to="/dashboard" className="btn btn-ghost btn-sm">
                        <ArrowLeft size={15} /> Back to Dashboard
                    </Link>
                    <div className="analytics-title-group">
                        <h1 className="analytics-title">
                            <BarChart2 size={24} /> Link Analytics
                        </h1>
                        {urlInfo && (
                            <div className="analytics-url-info">
                                <a
                                    href={`http://localhost:8080/${shortUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="analytics-short-link"
                                >
                                    <Link2 size={14} />
                                    linklytics.io/{shortUrl}
                                </a>
                                <span className="analytics-original">{urlInfo.originalUrl}</span>
                            </div>
                        )}
                    </div>
                    <p className="analytics-period">
                        <Calendar size={14} />
                        {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                        {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {loading ? (
                    <div className="loading-state" style={{ height: 400 }}>
                        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
                        <p>Loading analytics...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-error">{error}</div>
                ) : (
                    <>
                        {/* Stat cards */}
                        <div className="analytics-stats animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="card stat-card-item">
                                <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                                    <MousePointerClick size={22} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{totalClicks}</div>
                                    <div className="stat-label">Clicks (30 days)</div>
                                </div>
                            </div>
                            <div className="card stat-card-item">
                                <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                                    <TrendingUp size={22} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{maxClicks}</div>
                                    <div className="stat-label">Peak Day Clicks</div>
                                </div>
                            </div>
                            <div className="card stat-card-item">
                                <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                                    <Activity size={22} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">
                                        {clickData.length > 0 ? (totalClicks / clickData.length).toFixed(1) : 0}
                                    </div>
                                    <div className="stat-label">Daily Average</div>
                                </div>
                            </div>
                        </div>

                        {/* Area Chart - This Link */}
                        <div className="chart-card card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <div className="chart-header">
                                <h2 className="chart-title">Clicks Over Time <span className="badge badge-primary">This Link</span></h2>
                            </div>
                            {clickData.length === 0 ? (
                                <div className="no-data">No click data available for this period.</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={clickData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#64748b', fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis
                                            tick={{ fill: '#64748b', fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="clicks"
                                            stroke="#6366f1"
                                            strokeWidth={2.5}
                                            fill="url(#clickGrad)"
                                            dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                                            activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: 'rgba(99,102,241,0.3)' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Bar Chart - All Links Total */}
                        <div className="chart-card card animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <div className="chart-header">
                                <h2 className="chart-title">Total Clicks Across All Links <span className="badge badge-success">All Links</span></h2>
                            </div>
                            {totalData.length === 0 ? (
                                <div className="no-data">No data available for this period.</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={totalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#64748b', fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis
                                            tick={{ fill: '#64748b', fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="clicks"
                                            fill="url(#barGrad)"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Link2, LayoutDashboard, LogOut, LogIn, UserPlus, Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <Zap size={18} />
                    </div>
                    <span className="brand-name">Linklytics</span>
                </Link>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <span className="user-greeting">
                                Hey, <strong>{user?.username}</strong>
                            </span>
                            <Link to="/dashboard" className="btn btn-ghost btn-sm">
                                <LayoutDashboard size={15} />
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn btn-danger btn-sm">
                                <LogOut size={15} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">
                                <LogIn size={15} />
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                <UserPlus size={15} />
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

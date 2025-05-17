import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Code3Graphix.svg';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
            navigate('/');
        }, 1800); // modal shows briefly before redirect
    };

    return (
        <nav className="navbar">
            <header>
                <img src={logo} alt="Code3Graphix Logo" className="logo" />
            </header>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                {isLoggedIn ? (
                    <li>
                        {/* Styled link, but runs logic on click */}
                        <Link to="#" onClick={handleLogout}>Logout</Link>
                    </li>
                ) : (
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                )}
            </ul>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="logoutModal">
                        <p>You have been logged out successfully.</p>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

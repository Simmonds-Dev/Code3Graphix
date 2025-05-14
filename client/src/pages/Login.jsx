import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isSignup
            ? 'http://localhost:3001/api/signup'
            : 'http://localhost:3001/api/login';

        const payload = isSignup
            ? {
                user_name: formData.user_name,
                user_email: formData.user_email,
                user_password: formData.user_password,
            }
            : {
                user_email: formData.user_email,
                user_password: formData.user_password,
            };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                const err = await response.json();
                alert(err.message || 'Authentication failed.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

                {isSignup && (
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                )}

                <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="user_password"
                    value={formData.user_password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />

                <button type="submit">
                    {isSignup ? 'Sign Up' : 'Login'}
                </button>
                <p>
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    <span onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? ' Login' : ' Sign Up'}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;

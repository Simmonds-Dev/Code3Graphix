import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            // If accessed directly without order data, redirect to home
            navigate('/');
        }
    }, [order, navigate]);

    if (!order) return null;

    const {
        id,
        email,
        quantity,
        description,
        size,
        color,
        urgency,
        message,
        personalArtwork,
        user,
        order_items
    } = order;

    const product = order_items?.[0]?.product;

    return (
        <div className="confirmation-container">
            <h1>🎉 Thank You for Your Order!</h1>
            <p>We'll review your request and come back to you with a design concept as soon as possible</p>

            <h3>🔖 Order Details:</h3>
            <ul>
                <li><strong>Order ID:</strong> #{id}</li>
                <li><strong>Customer:</strong> {user?.user_name || 'N/A'}</li>
                <li><strong>Email:</strong> {email}</li>
                <li><strong>Product:</strong> {product?.product_name}</li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Quantity:</strong> {quantity}</li>
                <li><strong>Size:</strong> {size}</li>
                <li><strong>Color:</strong> {color}</li>
                <li><strong>Urgency:</strong> {urgency}</li>
                <li><strong>Personal Artwork:</strong> {personalArtwork ? 'Yes' : 'No'}</li>
                <li><strong>Message:</strong> {message}</li>
            </ul>

            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default Confirmation;

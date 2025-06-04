import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    console.log('Confirmation page order data:', order);


    useEffect(() => {
        if (!order) {
            navigate('/');
        } else {
            console.log('Navigating to confirmation page with:', order);
        }
    }, [order, navigate]);

    if (!order) return null;

    const item = order.order_items?.[0]; // safely get first item
    const product = item?.product;

    return (
        <div className="confirmation-page">
            <h2>Order Confirmation</h2>
            <p><strong>Customer:</strong> {order.user?.user_name}</p>
            <p><strong>Email Sent To:</strong> {order.user?.user_email}</p>
            <p><strong>Product:</strong> {product?.product_name}</p>
            <p><strong>Description:</strong> {product?.product_description}</p>
            <p><strong>Quantity:</strong> {item?.quantity}</p>
            <p><strong>Size:</strong> {item?.size}</p>
            <p><strong>Color:</strong> {item?.color}</p>
            <p><strong>Urgency:</strong> {order.urgency}</p>
            <p><strong>Custom Message:</strong> {order.message}</p>
            {order.personalArtwork && <p><strong>Includes Personal Artwork</strong></p>}
        </div>
    );
};

export default Confirmation;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assuming token is stored in localStorage
                const token = localStorage.getItem('token');

                // const ordersResponse = await axios.get('/api/orders', {
                //     headers: { Authorization: `Bearer ${token}` }
                // });

                const productsResponse = await axios.get('/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(ordersResponse.data);
                setProducts(productsResponse.data);
            } catch (err) {
                console.error(err);
                navigate('/login'); // redirect if not authorized
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <section>
                <h2>Orders</h2>
                {/* Map orders and display */}
            </section>

            <section>
                <h2>Products</h2>
                {/* Map products and allow editing */}
            </section>
        </div>
    );
};

export default AdminDashboard;

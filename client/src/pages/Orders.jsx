import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import beverageHolderImg from "../assets/beverage_holder.png";


const Orders = () => {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    const selectedProduct = state?.product;

    const [decodedEmail, setDecodedEmail] = useState('');
    const [token, setToken] = useState('');


    const [formData, setFormData] = useState({
        partNumber: '',
        description: '',
        quantity: '',
        size: '',
        color: '',
        email: '',
        urgency: '',
        message: '',
        personalArtwork: false,
        file: null,
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        try {
            if (storedToken) {
                const decoded = jwtDecode(storedToken);
                setDecodedEmail(decoded.user_email);
                setToken(storedToken); // Sets the token in state
                setFormData((prev) => ({
                    ...prev,
                    email: decoded.user_email || '',
                }));
            }
        } catch (err) {
            console.error('Failed to decode token:', err);
        }
    }, []);

    useEffect(() => {
        if (state && selectedProduct) {
            setFormData((prev) => ({
                ...prev,
                partNumber: selectedProduct.id,
                productId: selectedProduct.id,
                description: selectedProduct.product_name,
                size: typeof state.size === 'object' ? state.size.size_name || '' : state.size || '',
                color: typeof state.color === 'object' ? state.color.color_name || '' : state.color || '',
            }));
        }
    }, [state, selectedProduct]);



    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Order submitted:', formData);

        const formPayload = new FormData();
        formPayload.append("partNumber", formData.partNumber);
        formPayload.append("productId", formData.productId);
        formPayload.append("description", formData.description);
        formPayload.append("quantity", formData.quantity);
        formPayload.append("size", formData.size);
        formPayload.append("color", formData.color);
        formPayload.append("email", formData.email);
        formPayload.append("urgency", formData.urgency);
        formPayload.append("message", formData.message);
        formPayload.append("personalArtwork", formData.personalArtwork);
        if (formData.file) {
            formPayload.append("file", formData.file);
        }

        try {
            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                body: formPayload,
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to submit order');
            }

            const data = await response.json();
            console.log('Order created successfully:', data);

            // OPTIONAL: Navigate to confirmation page or clear form
            // navigate('/confirmation', { state: { order: data } });

        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="orderForm">
            <h2>Based off your selection, we've auto-filled some information about your request.</h2>

            <div className="form-columns">

                <div className="top-portion">
                    <div className="form-group">
                        <aside className="image-container">
                            <div>
                                <img src={beverageHolderImg} alt="Order Example Image" />
                            </div>
                            <div className='partAndDescription'>
                                <div className="form-group">
                                    <label htmlFor="partNumber">
                                        Part Number:
                                        <input id="part_number" type="text" name="partNumber" value={formData.partNumber} onChange={handleChange} required disabled />
                                    </label>
                                    <label htmlFor="description">
                                        Description:
                                        <input id="description" type="text" name="description" value={formData.description} onChange={handleChange} required disabled />
                                    </label>
                                    <label htmlFor="size">
                                        Size:
                                        <input id="size" type="text" name="size" value={formData.size} onChange={handleChange} required disabled />
                                    </label>
                                    <label htmlFor="color">
                                        Color:
                                        <input id="color" type="text" name="color" value={formData.color || ''} onChange={handleChange} required disabled />
                                    </label>
                                    <label htmlFor="email">
                                        Email:
                                        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required disabled />
                                    </label>
                                </div>
                            </div>
                        </aside>
                    </div>

                </div>

                <div className="bottom-portion">
                    <div className="form-group">
                        <label id="message" htmlFor="message">
                            Please tell us a bit more about your concept. We hope to collaborate with you and we will get back to you A.S.A.P. That way, if there are any additional questions we will have an open line of communication. If you've logged in, your email should be auto-filled below.
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Type here..."
                        />
                        <div className='form-group'>
                            <label id="quantity" htmlFor="quantity">
                                How many were you looking to have done?:
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                            </label>
                            <label htmlFor="personalArtwork">
                                Including Personal Artwork?
                                <input type="checkbox" name="personalArtwork" checked={formData.personalArtwork} onChange={handleChange} />
                            </label>
                            <label htmlFor="file">
                                Upload File:
                                <input type="file" name="file" onChange={handleChange} />
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        {/* Explore adding a calendar a user can select from, that way this can auto-format the date insead of risking an invalid entry */}
                        <label htmlFor="urgency">
                            Needed By:
                            <select name="urgency" value={formData.urgency} onChange={handleChange} required>
                                <option value="standard">Standard (7–10 Business Days)</option>
                                <option value="priority">Priority (3–5 Business Days)</option>
                                <option value="rush">Rush (1–2 Business Days)</option>
                            </select>

                        </label>
                    </div>
                </div>
            </div>



            <button type="submit">Submit</button>

        </form>
    );
};

export default Orders;
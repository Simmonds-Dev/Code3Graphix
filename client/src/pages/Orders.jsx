import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import beverageHolderImg from "../assets/beverage_holder.png";

const Orders = () => {
    const { state } = useLocation();
    const selectedProduct = state?.product;

    const [formData, setFormData] = useState({
        partNumber: '',
        description: '',
        quantity: '',
        size: '',
        email: '',
        urgency: '',
        message: '',
        personalArtwork: false,
        file: null,
    });

    useEffect(() => {
        if (selectedProduct) {
            setFormData((prev) => ({
                ...prev,
                partNumber: selectedProduct.id,
                description: selectedProduct.product_name,
                size: selectedProduct.size || '',
                // You can add other fields based on available product data
            }));
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order submitted:', formData);
        // Post to /api/orders here
    };

    return (
        <form onSubmit={handleSubmit} className="orderForm">
            <h2>Start your order here!</h2>

            <div className="form-columns">

                <div className="left-column">
                    <div className="form-group">
                        <div className="image-container">
                            <img src={beverageHolderImg} alt="Order Example Image" />
                        </div>
                        <label htmlFor="partNumber">
                            Part Number:
                            <input id="part_number" type="text" name="partNumber" value={formData.partNumber} onChange={handleChange} required disabled />
                        </label>
                        <div className="form-group">
                            <label htmlFor="description">
                                Description:
                                <input id="description" type="text" name="description" value={formData.description} onChange={handleChange} required disabled />
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="size">
                                Size:
                                <input type="text" name="size" value={formData.size} onChange={handleChange} required />
                            </label>
                        </div>
                    </div>

                </div>

                <div className="right-column">
                    <div className="form-group">
                        <div className="form-group">
                            <label id="message" htmlFor="message">
                                Please tell us a bit more about your concept. We hope to collaborate with you and respond via email with some design concepts before we come to an agreement:
                            </label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required />
                        </div>
                        <label htmlFor="quantity">
                            How many were you looking to have done?:
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="personalArtwork">
                            Including Personal Artwork?
                            <input type="checkbox" name="personalArtwork" checked={formData.personalArtwork} onChange={handleChange} />
                        </label>
                        <label htmlFor="file">
                            Upload File:
                            <input type="file" name="file" onChange={handleChange} />
                        </label>
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

            <div className="form-group email">
                <label htmlFor="email">
                    Email:
                    {/* Will need to adjust value={user_email} once you get JWT set up */}
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled />
                </label>
            </div>

            <button type="submit">Submit</button>

        </form>
    );
};

export default Orders;
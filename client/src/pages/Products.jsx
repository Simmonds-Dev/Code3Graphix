import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [productSelections, setProductSelections] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                // Initialize selections per product
                const initialSelections = {};
                data.forEach((product) => {
                    const colors = Array.isArray(product.colors)
                        ? product.colors
                        : (product.colors || '').split(',');
                    const sizes = Array.isArray(product.sizes)
                        ? product.sizes
                        : (product.sizes || '').split(',');
                    initialSelections[product.id] = {
                        quantity: 1,
                        color: colors[0] || '',
                        size: sizes[0] || '',
                    };
                });
                setProductSelections(initialSelections);
            })
            .catch((err) => console.error('Failed to fetch products:', err));
    }, []);

    const handleSelect = (product) => {
        const selection = productSelections[product.id];
        navigate('/orders', {
            state: {
                product,
                quantity: selection.quantity,
                color: selection.color,
                size: selection.size,
            },
        });
    };

    const handleChange = (productId, field, value) => {
        setProductSelections((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value,
            },
        }));
    };

    return (
        <>
            <h1>Featured Products</h1>
            <div className="products">
                <div className="product-grid">
                    {products.map((product) => {
                        const selection = productSelections[product.id] || {};
                        const colors = Array.isArray(product.colors)
                            ? product.colors
                            : (product.colors || '').split(',');
                        const sizes = Array.isArray(product.sizes)
                            ? product.sizes
                            : (product.sizes || '').split(',');

                        return (
                            <div key={product.id} className="product-card">
                                {product.image_url && (
                                    <img
                                        src={product.image_url}
                                        alt={product.product_name}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <h2>{product.product_name}</h2>
                                <p>Category: {product.category?.category_name}</p>
                                <p>Price: ${product.product_price}</p>
                                <p>Tags: {product.tags?.map(tag => tag.tag_name).join(', ')}</p>


                                <div className="form-group">
                                    <label>Color:</label>
                                    <select
                                        value={selection.color || ''}
                                        onChange={(e) =>
                                            handleChange(product.id, 'color', e.target.value)
                                        }
                                    >
                                        {colors.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Size:</label>
                                    <select
                                        value={selection.size || ''}
                                        onChange={(e) =>
                                            handleChange(product.id, 'size', e.target.value)
                                        }
                                    >
                                        {sizes.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <button onClick={() => handleSelect(product)}>Start Order</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Products;

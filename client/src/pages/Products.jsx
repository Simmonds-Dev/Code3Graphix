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
                const initialSelections = {};
                data.forEach((product) => {
                    const sizes = Array.isArray(product.sizes)
                        ? product.sizes
                        : String(product.sizes || '').split(',').map(s => s.trim());
                    const colors = Array.isArray(product.colors)
                        ? product.colors
                        : String(product.colors || '').split(',').map(c => c.trim());

                    initialSelections[product.id] = {
                        quantity: 1,
                        size: sizes[0] || '',
                        color: colors[0] || '',
                    };
                });
                setProductSelections(initialSelections);
            })
            .catch((err) => console.error('Failed to fetch products:', err));
    }, []);

    const handleSelect = (product) => {
        const selection = productSelections[product.id] || {};

        navigate('/orders', {
            state: {
                product,
                ...selection
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

    const normalizeOptions = (value, type) => {
        if (Array.isArray(value)) {
            return value.map((v) => {
                if (type === 'color') return v.color_name;
                if (type === 'size') return v.size_name;
                return '';
            }).filter(Boolean);
        }
        return [];
    };


    return (
        <>
            <h1>Featured Products</h1>
            <div className="products">
                <div className="product-grid">
                    {products.map((product) => {
                        const selection = productSelections[product.id] || {};
                        const colors = normalizeOptions(product.colors, 'color');
                        const sizes = normalizeOptions(product.sizes, 'size');

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

                                <div className="form-group">
                                    <label>Color:</label>
                                    <select
                                        value={selection.color || ''}
                                        onChange={(e) => handleChange(product.id, 'color', e.target.value)}
                                    >
                                        <option value="" disabled>Select a color</option>
                                        {colors.map((colorName) => (
                                            <option key={colorName} value={colorName}>
                                                {colorName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Size:</label>
                                    <select
                                        value={selection.size || ''}
                                        onChange={(e) => handleChange(product.id, 'size', e.target.value)}
                                    >
                                        <option value="" disabled>Select a size</option>
                                        {sizes.map((sizeName) => (
                                            <option key={sizeName} value={sizeName}>
                                                {sizeName}
                                            </option>
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

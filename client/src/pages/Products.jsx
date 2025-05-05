import React, { useEffect, useState } from 'react';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/products')
            .then((res) => res.json())
            .then((data) => {
                console.log('Fetched products:', JSON.stringify(data, null, 2));
                setProducts(data);
            })
            .catch((err) => console.error('Failed to fetch products:', err));
    }, []);

    return (
        <div className="products">
            <h1>Featured Products</h1>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <h2>{product.product_name}</h2>
                        <p>Category: {product.category?.category_name}</p>
                        <p>Price: ${product.product_price}</p>
                        <p>Tags: {product.tags?.map(tag => tag.tag_name).join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;

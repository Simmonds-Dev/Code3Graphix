import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CategoryProducts = () => {
    const { category_name } = useParams();
    const [products, setProducts] = useState([]);
    const [selections, setSelections] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!category_name) {
            console.warn('No category_name provided');
            setProducts([]);
            return;
        }


        fetch(`http://localhost:3001/api/shop/category/${category_name}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server responded with status ${res.status}`);
                }
                return res.text();
            })
            .then(text => {
                try {
                    const data = JSON.parse(text);
                    setProducts(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    setProducts([]);
                }
            })
            .catch(err => console.error('Error fetching products:', err));
    }, [category_name]);

    const handleChange = (productId, field, value) => {
        setSelections(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value,
            }
        }));
    };

    const handleSelect = (product) => {
        const selection = selections[product.id] || {};
        navigate('/orders', {
            state: {
                product,
                ...selection,
            }
        });
    };

    return (
        <>
            <h1>{category_name.charAt(0).toUpperCase() + category_name.slice(1).toLowerCase()} Products</h1>
            <div className="product-grid">
                {products.map((prod) => {
                    const selection = selections[prod.id] || {};
                    const colors = prod.colors?.map(c => c.color_name) || [];
                    const sizes = prod.sizes?.map(s => s.size_name) || [];

                    return (
                        <div key={prod.id} className="product-card">
                            <img src={prod.image_url} alt={prod.product_name} />
                            <h2>{prod.product_name}</h2>
                            <p>${prod.product_price}</p>
                            <label>Color:
                                <select value={selection.color} onChange={(e) => handleChange(prod.id, 'color', e.target.value)}>
                                    {colors.map(color => <option key={color} value={color}>{color}</option>)}
                                </select>
                            </label>
                            <label>Size:
                                <select value={selection.size} onChange={(e) => handleChange(prod.id, 'size', e.target.value)}>
                                    {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                                </select>
                            </label>
                            <button onClick={() => handleSelect(prod)}>Start Order</button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default CategoryProducts;

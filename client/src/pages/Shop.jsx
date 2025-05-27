import { useNavigate } from 'react-router-dom';
import drinkwareIcon from '../assets/drinkware.png';
import woodIcon from '../assets/wood.png';
import leatherIcon from '../assets/leather.png';
import metalIcon from '../assets/metal.png';

const categories = [
    { name: 'Drinkware', image: drinkwareIcon },
    { name: 'Wood', image: woodIcon },
    { name: 'Leather', image: leatherIcon },
    { name: 'Metal', image: metalIcon },
];

const Shop = () => {
    const navigate = useNavigate();

    const goToCategory = (categoryName) => {
        navigate(`/shop/${categoryName.toLowerCase()}`);
    };

    return (
        <div className="category-grid">
            {categories.map((cat) => (
                <div key={cat.name} className="category-card" onClick={() => goToCategory(cat.name)}>
                    <h2>{cat.name}</h2>
                    <img className="catImg" src={cat.image} alt={cat.name} />
                </div>
            ))}
        </div>
    );
};

export default Shop;

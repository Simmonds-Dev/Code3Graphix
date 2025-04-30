import Product from './Product.js';
import Category from './Category.js';
import Tag from './Tag.js';
import ProductTag from './ProductTag.js';
import User from './User.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

Product.belongsTo(User)

User.hasMany(Product);

Product.belongsTo(Category);

Category.hasMany(Product);

Product.belongsToMany(Tag, {
    through: {
        model: ProductTag
    }
});

Tag.belongsToMany(Product, {
    through: {
        model: ProductTag
    }
});

User.hasMany(Order, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Order.belongsTo(User, {
    foreignKey: 'user_id'
});

Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id'
});

Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE'
});

OrderItem.belongsTo(Product, {
    foreignKey: 'product_id'
});

export { Product, User, Category, Tag, ProductTag, Order, OrderItem };
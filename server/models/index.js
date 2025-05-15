import Product from './Product.js';
import Category from './Category.js';
import Color from './Color.js';
import ProductColor from './ProductColor.js';
import Size from './Size.js';
import ProductSize from './ProductSize.js';
import User from './User.js';
import Orders from './Order.js';
import OrderItem from './OrderItem.js';

// User ⇄ Product
Product.belongsTo(User);
User.hasMany(Product);

// Product ⇄ Category
Product.belongsTo(Category);
Category.hasMany(Product);

// Product ⇄ Color (Many-to-Many)
Product.belongsToMany(Color, { through: ProductColor, foreignKey: 'product_id' });
Color.belongsToMany(Product, { through: ProductColor, foreignKey: 'color_id' });

// Product ⇄ Size (Many-to-Many)
Product.belongsToMany(Size, { through: ProductSize, foreignKey: 'product_id' });
Size.belongsToMany(Product, { through: ProductSize, foreignKey: 'size_id' });

// User ⇄ Orders
User.hasMany(Orders, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});
Orders.belongsTo(User, {
    foreignKey: 'user_id',
});

// Orders ⇄ OrderItem
Orders.hasMany(OrderItem, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
});
OrderItem.belongsTo(Orders, {
    foreignKey: 'order_id',
});

// Product ⇄ OrderItem
Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
});
OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
});

export {
    Product,
    User,
    Category,
    Color,
    ProductColor,
    Size,
    ProductSize,
    Orders,
    OrderItem,
};

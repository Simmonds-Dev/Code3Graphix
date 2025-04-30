import sequelize from '../config/connection.js';
import { Product, User, Category, Tag, ProductTag, Order, OrderItem } from '../models/index.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed because __dirname doesn't exist in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to load JSON
async function loadJSON(filePath) {
    const data = await readFile(path.join(__dirname, filePath), 'utf-8');
    return JSON.parse(data);
}

const seedAll = async () => {
    await sequelize.sync({ force: true });

    const userData = await loadJSON('./userData.json');
    const categoryData = await loadJSON('./categoryData.json');
    const productData = await loadJSON('./productData.json');
    const tagData = await loadJSON('./tagData.json');
    const productTagData = await loadJSON('./productTagData.json');
    const orderData = await loadJSON('./orderData.json');
    const orderItemData = await loadJSON('./orderItemData.json');

    await User.bulkCreate(userData, { individualHooks: true, returning: true });
    await Category.bulkCreate(categoryData);
    await Product.bulkCreate(productData);
    await Tag.bulkCreate(tagData);
    await ProductTag.bulkCreate(productTagData);
    await Order.bulkCreate(orderData);
    await OrderItem.bulkCreate(orderItemData);

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
};

seedAll();

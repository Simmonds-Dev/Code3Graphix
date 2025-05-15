import sequelize from '../config/connection.js';
import { Product, User, Category, Color, ProductColor, Size, ProductSize, Orders, OrderItem } from '../models/index.js';
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
    const colorData = await loadJSON('./colorData.json');
    const productColorData = await loadJSON('./productColorData.json');
    const sizeData = await loadJSON('./sizeData.json');
    const productSizeData = await loadJSON('./productSizeData.json');
    const orderData = await loadJSON('./orderData.json');
    const orderItemData = await loadJSON('./orderItemData.json');

    await User.bulkCreate(userData, { individualHooks: true, returning: true });
    await Category.bulkCreate(categoryData);
    await Product.bulkCreate(productData);
    await Color.bulkCreate(colorData);
    await ProductColor.bulkCreate(productColorData);
    await Size.bulkCreate(sizeData);
    await ProductSize.bulkCreate(productSizeData);
    await Orders.bulkCreate(orderData);
    await OrderItem.bulkCreate(orderItemData);

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
};

seedAll();

import express from 'express';
import {
    Product,
    Category,
    User,
    Color,
    Size,
    ProductColor,
    ProductSize,
} from '../../models/index.js';
import { Op } from 'sequelize';


const router = express.Router();

// ===============================
// GET all products
// ===============================
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: User, attributes: ['id', 'user_name', 'user_email'] },
                { model: Category },
                { model: Color, through: { attributes: [] } },
                { model: Size, through: { attributes: [] } },
            ],
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/category/:category_name', async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                category_name: {
                    [Op.like]: req.params.category_name 
                }
            },
            include: [{
                model: Product,
                include: [Color, Size]
            }]
        });

        if (!category) {
            console.log('No category found with name:', req.params.category_name);
            return res.status(404).json({ message: 'Category not found' });
        }

        console.log('Found category:', category.category_name);
        console.log('Products:', category.products);

        res.json(category.products);
    } catch (err) {
        console.error('Error in /category route:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ===============================
// GET single product by ID
// ===============================
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [Category, Color, Size],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// CREATE a new product
// ===============================
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);

        // Handle colors and sizes
        if (req.body.colorIds?.length) {
            const productColors = req.body.colorIds.map((color_id) => ({
                product_id: product.id,
                color_id,
            }));
            await ProductColor.bulkCreate(productColors);
        }

        if (req.body.sizeIds?.length) {
            const productSizes = req.body.sizeIds.map((size_id) => ({
                product_id: product.id,
                size_id,
            }));
            await ProductSize.bulkCreate(productSizes);
        }

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// UPDATE an existing product
// ===============================
router.put('/:id', async (req, res) => {
    try {
        const [affectedRows] = await Product.update(req.body, {
            where: { id: req.params.id },
        });

        if (!affectedRows) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Update color associations
        if (req.body.colorIds) {
            await ProductColor.destroy({ where: { product_id: req.params.id } });
            const productColors = req.body.colorIds.map((color_id) => ({
                product_id: req.params.id,
                color_id,
            }));
            await ProductColor.bulkCreate(productColors);
        }

        // Update size associations
        if (req.body.sizeIds) {
            await ProductSize.destroy({ where: { product_id: req.params.id } });
            const productSizes = req.body.sizeIds.map((size_id) => ({
                product_id: req.params.id,
                size_id,
            }));
            await ProductSize.bulkCreate(productSizes);
        }

        res.json({ message: 'Product updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// DELETE a product
// ===============================
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.destroy({
            where: { id: req.params.id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json({ message: 'Product deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

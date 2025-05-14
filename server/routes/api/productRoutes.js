import express from 'express';
import { Product, Category, Tag, ProductTag } from '../../models/index.js';

const router = express.Router();

// ===============================
// GET all products
// ===============================
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [Category, Tag],
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// GET single product by ID
// ===============================
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [Category, Tag],
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

        // If tag IDs are provided, create associations in ProductTag
        if (req.body.tagIds && req.body.tagIds.length) {
            const productTagArr = req.body.tagIds.map((tag_id) => ({
                product_id: product.id,
                tag_id,
            }));
            await ProductTag.bulkCreate(productTagArr);
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

        // Handle tags if included
        if (req.body.tagIds) {
            const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

            const existingTagIds = productTags.map(({ tag_id }) => tag_id);
            const newTagIds = req.body.tagIds.filter((tag_id) => !existingTagIds.includes(tag_id));
            const tagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id));

            await Promise.all([
                ProductTag.destroy({ where: { id: tagsToRemove.map(({ id }) => id) } }),
                ProductTag.bulkCreate(newTagIds.map((tag_id) => ({
                    product_id: req.params.id,
                    tag_id,
                }))),
            ]);
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

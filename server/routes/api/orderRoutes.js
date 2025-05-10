import express from 'express';
import { Orders, OrderItem, Product } from '../../models/index.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Orders.findAll({
            include: [{ model: OrderItem, include: [Product] }]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Orders.findByPk(req.params.id, {
            include: [{ model: OrderItem, include: [Product] }]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const {
            partNumber,
            description,
            quantity,
            size,
            message,
            urgency,
            // email,
        } = req.body;

        // Create the order
        const order = await Orders.create({
            description,
            size,
            message,
            urgency,
            // email,
            personalArtwork: !!personalArtwork // ensure it's a boolean
        });

        // If productId is provided, add to OrderItems
        if (productId) {
            await OrderItem.create({
                order_id: order.id,
                product_id: productId,
                quantity,
                part_number: partNumber
            });
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

import express from 'express';
import { User, Orders, OrderItem, Product } from '../../models/index.js';
import withAuth from '../../utils/withAuth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .png, and .pdf files are allowed.'));
        }
    }
});

// Get all orders
router.get('/', withAuth, async (req, res) => {
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
router.get('/:id', withAuth, async (req, res) => {
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
router.post('/', withAuth, upload.single('file'), async (req, res) => {
    const userEmail = req.user?.user_email;

    try {
        const {
            description,
            quantity,
            color,
            size,
            message,
            urgency,
            email,
            productId,
            personalArtwork
        } = req.body;

        const filePath = req.file ? req.file.path : null;

        const parsedProductId = parseInt(productId, 10);
        const parsedQuantity = parseInt(quantity, 10);

        if (!parsedProductId) {
            return res.status(400).json({ error: 'Invalid productId' });
        }

        // Step 1: Create the Order
        const order = await Orders.create({
            user_id: req.user.user_id,
            productId: parsedProductId,
            description,
            size,
            color,
            email: userEmail || email,
            message,
            quantity: parsedQuantity,
            urgency,
            personalArtwork: personalArtwork === 'true' || personalArtwork === true,
            filePath
        });

        // Step 2: Create OrderItem (join table between order & product)
        await OrderItem.create({
            order_id: order.id,
            product_id: parsedProductId,
            quantity: parsedQuantity,
        });

        // Step 3: Fetch full order with associations
        const fullOrder = await Orders.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    include: [{ model: Product }]
                },
                {
                    model: User,
                    attributes: ['user_name', 'user_email']
                }
            ]
        });

        // Final response to frontend
        console.log(fullOrder);
        res.status(201).json(fullOrder);

    } catch (err) {
        console.error('Order submission error:', err);
        res.status(500).json({ error: err.message });
    }
});



export default router;
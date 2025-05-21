import express from 'express';
import { Orders, OrderItem, Product } from '../../models/index.js';
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
            partNumber,
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
        console.log('req.user:', req.user);
        console.log('req.body:', req.body);

        const parsedProductId = parseInt(productId, 10); // 👈 This is important

        if (!parsedProductId) {
            return res.status(400).json({ error: 'Invalid productId' });
        }


        const order = await Orders.create({
            user_id: req.user.user_id,
            productId: parsedProductId,
            partNumber,
            description,
            size,
            color,
            email: userEmail || req.body.user_email,
            message,
            quantity,
            urgency,
            personalArtwork: personalArtwork === 'true' || personalArtwork === true,
            filePath
        });

        if (productId) {
            await OrderItem.create({
                order_id: order.id,
                product_id: productId,
                quantity,
                part_number: partNumber
            });

            // Optional email function
            // await sendConfirmationEmail(order.email, order.id);
        }

        res.status(201).json(order);
    } catch (err) {
        console.error('Order submission error:', err);
        res.status(500).json({ error: err.message });
    }
});


export default router;

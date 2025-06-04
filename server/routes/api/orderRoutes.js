import express from 'express';
import { User, Orders, OrderItem, Product } from '../../models/index.js';
import withAuth from '../../utils/withAuth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendOrderEmail } from '../../utils/email.js';
import fs from 'fs/promises';

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

        let updatedFilePath = null;

        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const newFileName = `order-${order.id}-${req.file.originalname.replace(/\s+/g, '_')}`;
            const newFilePath = path.join(path.dirname(req.file.path), newFileName);

            try {
                await fs.rename(req.file.path, newFilePath);
                updatedFilePath = newFilePath;
                await order.update({ filePath: updatedFilePath });
            } catch (renameErr) {
                console.error('Error renaming file:', renameErr);
            }
        }

        // Step 2: Create OrderItem (join table)
        await OrderItem.create({
            order_id: order.id,
            product_id: parsedProductId,
            quantity: parsedQuantity,
            color,
            size
        });

        // Step 3: Fetch full order with associations
        const orderWithRelations = await Orders.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                },
                {
                    model: User,
                    attributes: ['user_name', 'user_email']
                }
            ]
        });

        // Step 4: Sanitize response
        const plainOrder = {
            ...orderWithRelations.get({ plain: true }),
            order_items: orderWithRelations.order_items.map(item => ({
                ...item.get({ plain: true }),
                product: item.product?.get({ plain: true })
            })),
            user: orderWithRelations.user?.get({ plain: true })
        };

        // Step 5: Send email confirmation
        try {
            await sendOrderEmail(orderWithRelations, updatedFilePath);
            console.log('Back End - Email sent!');
        } catch (emailErr) {
            console.error('Email failed:', emailErr);
        }

        // Step 6: Send to frontend
        res.status(201).json(plainOrder);

    } catch (err) {
        console.error('Back End - Order submission error:', err);
        res.status(500).json({ error: err.message });
    }
});



export default router;
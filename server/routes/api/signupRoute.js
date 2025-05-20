import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// POST /api/signup
router.post('/', async (req, res) => {
    const { user_name, user_email, user_password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { user_email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const user = await User.create({
            user_name,
            user_email,
            user_password
        });

        const token = jwt.sign(
            {
                id: user.id,
                user_name: user.user_name,
                user_email: user.user_email
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            token,
            user: { id: user.id, user_name: user.user_name }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;

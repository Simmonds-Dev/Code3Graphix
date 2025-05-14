import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';
import * as dotenv from 'dotenv';

dotenv.config();


const router = express.Router();

// POST /api/login
router.post('/', async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
        const user = await User.findOne({ where: { user_email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const validPassword = await bcrypt.compare(user_password, user.user_password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, user_name: user.user_name },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            token,
            user: { id: user.id, user_name: user.user_name }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

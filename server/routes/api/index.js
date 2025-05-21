import express from 'express';
import shopRoutes from './shopRoutes.js';
import loginRoute from './loginRoute.js';
import signupRoute from './signupRoute.js';
import orderRoutes from './orderRoutes.js';

const router = express.Router();

router.use('/shop', shopRoutes);
router.use('/login', loginRoute);
router.use('/signup', signupRoute);
router.use('/orders', orderRoutes);

export default router;

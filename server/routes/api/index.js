import express from 'express';
import productRoutes from './productRoutes.js';
// import categoryRoutes from './categoryRoutes.js';
// import userRoutes from './userRoutes.js';
// import orderRoutes from './orderRoutes.js';
// import tagRoutes from './tagRoutes.js';

const router = express.Router();

router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/users', userRoutes);
// router.use('/orders', orderRoutes);
// router.use('/tags', tagRoutes);

export default router;

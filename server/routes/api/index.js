import express from 'express';
import productRoutes from './productRoutes.js';
// import categoryRoutes from './categoryRoutes.js';
import loginRoute from './loginRoute.js';
import signupRoute from './signupRoute.js';
// import orderRoutes from './orderRoutes.js';
// import tagRoutes from './tagRoutes.js';

const router = express.Router();

router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
router.use('/login', loginRoute);
router.use('/signup', signupRoute);
// router.use('/orders', orderRoutes);
// router.use('/tags', tagRoutes);

export default router;

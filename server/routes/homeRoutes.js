import express from 'express';

const router = express.Router();

// ===============================
// Home route (root of the app)
// ===============================
router.get('/', (req, res) => {
    res.send('Welcome to the Code3Graphix API!');
});


export default router;

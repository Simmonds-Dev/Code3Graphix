import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import sequelize from './config/connection.js';


import homeRoutes from './routes/homeRoutes.js';
import shopRoutes from './routes/api/shopRoutes.js';
import loginRoute from './routes/api/loginRoute.js';
import signupRoute from './routes/api/signupRoute.js';
// import categoryRoutes from './routes/api/categoryRoutes.js';
import orderRoutes from './routes/api/orderRoutes.js';

dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS config
const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/', (req, res, next) => {
    next();
});


// JWT Middleware
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(401);
    }
};

// Routes
app.use('/', homeRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);
app.use('/api/orders', authenticateJWT, orderRoutes);

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});


// Start server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
});

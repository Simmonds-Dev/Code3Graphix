import path from 'path';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import routes from './routes';
import sequelize from './config/connection';
import * as dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware
const corsOptions = {
    origin: ['http://localhost:3000'], // your client URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Serve static files from client/public
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Parse incoming JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Authentication Middleware (example)
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Invalid token
            }
            req.user = user; // attach user to the request
            next();
        });
    } else {
        next(); // no token provided, move on (some routes might be public)
    }
});

// Routes
app.use(routes);

// Sync sequelize models and start server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}!`));
});

import jwt from 'jsonwebtoken';

const withAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expect: "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Make decoded info available in route
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default withAuth;

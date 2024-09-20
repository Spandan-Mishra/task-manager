require('dotenv').config({ path: '../.env' });
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(403).json({msg: "Missing Token"});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
            req.userId = decoded.id;
            next()
        } else {
            return res.status(401).json({msg: "Incorrect token"});
        }
    } catch(err) {
        return res.status(404).json({msg: "Invalid token"});
    }
}

module.exports = {
    JWT_SECRET,
    auth
}

const JWT_SECRET = "secret";
const jwt = require('jsonwebtoken');

module.exports = {
    auth: (req, res, next) => {
        const authHeader = req.headers["authorization"];
        
        if (!authHeader) {
            return res.status(403).json({msg: "Missing auth header"});
        }
        try {
            const decoded = jwt.verify(authHeader, JWT_SECRET);
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
}
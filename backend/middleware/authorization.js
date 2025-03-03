const jwt = require('jsonwebtoken');
const secretKey = 'secret key';

// exporting a middleware function to handle JWT authentication
module.exports = function (req, res, next) {
    const authorization = req.headers.authorization;

    // checking if the 'Authorization' header is present and starts with 'Bearer '
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" });
    }

    // extracting the token part from the 'Authorization' header
    const token = authorization.split(' ')[1];

    try {
        // verifying the token using the secret key
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        next();
    } catch (e) {
        // handling token verification errors
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ error: true, message: 'JWT token has expired' });
        } else {
            return res.status(401).json({ error: true, message: 'Invalid JWT token' });
        }
    }
};

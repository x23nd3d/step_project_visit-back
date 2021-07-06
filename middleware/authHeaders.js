


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization;
        const decodedTokenHeader = jwt.verify(tokenHeader, 'test');
        req.jwtUserIDH = decodedTokenHeader.userId;
        next();
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

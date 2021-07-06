// module.exports = function (req, res, next) {
//     console.log(req.session);
//     if (!req.session.isAuthenticated) {
//         return res.json('User is not logged in');
//     }
//
//     next();
// }


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.body.token;
        const decodedToken = jwt.verify(token, 'test');
        req.jwtUserID = decodedToken.userId;

        // if (req.body.userId && req.body.userId !== userId) {
        //     throw 'Invalid user ID';
        // } else {
        //     next();
        // }
        next();
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

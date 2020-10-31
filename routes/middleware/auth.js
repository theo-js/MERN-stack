const config = require('../../config/keys')
const jwt = require('jsonwebtoken')

module.exports = function auth (req, res, next) {
    const token = req.header('x-auth-token')

    // Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied '})
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' })
    }
}
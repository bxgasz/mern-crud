const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //time login
    max: 5, //max login per minutes
    message: { message: 'Too many login attempts, please try again after 1 minutes' },
    handler: (req, res, next, options) => {
        logEvents( `Too Many Request: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, //return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
})

module.exports = loginLimiter
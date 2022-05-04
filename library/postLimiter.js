const rateLimit = require('express-rate-limit')

const postLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s
    max: 2, // start blocking after 2 requests
    message: "Không thể gửi quá 2 bài trong 10 giây!"
})

module.exports = postLimiter

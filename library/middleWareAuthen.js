const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env
const {UNAUTHORIZED, FORBIDDEN, BAD_REQUEST} = require('./constant')


function checkAuthen(req,res, next){
    console.log("vao back end")
    const headerAuthen = req.headers['authorization']
    console.log(headerAuthen) 
    if (headerAuthen == undefined){
        console.log("loi user2s")
        return res.sendStatus(FORBIDDEN)
    }
    const bearerToken = headerAuthen.split(' ')[1]
    if (bearerToken){
        jwt.verify(bearerToken, JWT_SECRET,(err, decode)=>{
            if(err){
                return res.sendStatus(FORBIDDEN)
            }
            req.userId = decode['id']
            next()
        })
    }
    else {
        return res.send("some error !!!")
    }
    
}

module.exports = checkAuthen
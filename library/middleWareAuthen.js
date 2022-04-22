const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env
const {UNAUTHORIZED, FORBIDDEN, BAD_REQUEST} = require('./constant')


function checkAuthen(req,res, next){
    const headerAuthen = req.headers['authorization']
    console.log("da vao nef ")
    console.log(headerAuthen)
    if (headerAuthen == undefined){
        return res.sendStatus(FORBIDDEN)
    }
    const bearerToken = headerAuthen.split(' ')[1]
    // console.log(bearerToken)
    if (bearerToken){
        console.log('da vao 1')
        jwt.verify(bearerToken, JWT_SECRET,(err, decode)=>{
            if(err){
                return res.sendStatus(FORBIDDEN)
            }
            console.log(decode['id'])
            req.userId = decode['id']
            next()


        })
    }
    else {
        return res.send("some error !!!")
    }
    
}

module.exports = checkAuthen
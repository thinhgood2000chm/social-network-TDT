const {BAD_REQUEST, USER_NOT_FOUND} = require('../../library/constant')

const account = require('../../models/user')
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
const { json } = require('express/lib/response')
const { use } = require('../routers/userRoute')
const {JWT_SECRET}=process.env


exports.register=(req,res)=>{
    var{fullname,username, password}= req.body;
    account.findOne({username: username}, (err, data)=>{
        if(data){
            return res.json({"decription": "username exist"})
        }

        bcrypt.hash(password, 10, (err, hashedPass)=>{
            if(err){
                return res.json({
                   error:err
                })
            }
           
            let newAccount = new account({
                fullname:fullname,
                picture:'https://images.squarespace-cdn.com/content/v1/5930dc9237c5817c00b10842/1557979868721-ZFEVPV8NS06PZ21ZC174/ke17ZwdGBToddI8pDm48kBtpJ0h6oTA_T7DonTC8zFdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIBqmMCQ1OP129tpEIJko8bi_9nfbnt8dRsNvtvnXdL8M/images.png',
                // given_name: given_name,
                // family_name: family_name,
                username: username,
                password: hashedPass,
            })
            newAccount.save()
            .then((data)=>{
                return res.json(data)
            })
            .catch(e=>console.log(e))
        
        })
    })
  
}

exports.login=(req,res)=>{
    var{username, password} = req.body
    if (!username){
        return res.status(BAD_REQUEST).json({"decription": "thiếu username"})
    }
    if (!password){
        return res.status(BAD_REQUEST).json({"decription": "thiếu password"})
    }
    account.findOne({username:username}).then(
        account=>{
            if(account){
                bcrypt.compare(password,account.password,(err, result)=>{
                    if(err){
                        res.json({error:err})
                    }
                    if(result){
                        let token = jwt.sign({id: account._id},JWT_SECRET,{expiresIn:'1h'})
                        return res.json({
                            "token": token,
                            "userInfo": account
                        })  
                    }
                    else{
                        return res.status(BAD_REQUEST).json({"decription": "Sai mật khẩu "})
                    }
                })
            }
            else
                return res.status(BAD_REQUEST).json({"decription": "username không tồn tại "})
            
        }
    )

}

exports.oauth2 =(req,res)=>{
    const headerAuthen = req.headers['authorization']
    const bearerToken = headerAuthen.split(' ')[1]
    console.log(bearerToken)
    var user = jwt.decode(bearerToken, JWT_SECRET)
    console.log(user)
    return res.send("haha")
}

exports.detail=(req,res)=>{
    var {userId} = req.params

    // kiểm tra id của user bằng cách lấy id sau khi decode của bearer token 
    // bước này chỉ để tránh query vào db nếu sai thôi
    if (userId !== req.userId){
        return res.json({"decription":USER_NOT_FOUND})
    }
    account.findById(userId, (err, userInfo)=>{
        // kiểm tra thêm trong này cho chắc 
        if (err){
            // return res.json({"decription":USER_NOT_FOUND})
            return res.json({"decription":USER_NOT_FOUND})
        }
        else{
            return res.json(userInfo)
        }

    })
 

   
}


const {BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE} = require('../../library/constant')

const account = require('../../models/user')
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
const { json } = require('express/lib/response')
const { use } = require('../routers/userRoute')
const res = require('express/lib/response')
const {JWT_SECRET}=process.env


exports.register=(req,res)=>{
    var{givenName, familyName,username, password}= req.body;
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
                fullname:`${givenName} ${familyName}`,
                picture:'https://images.squarespace-cdn.com/content/v1/5930dc9237c5817c00b10842/1557979868721-ZFEVPV8NS06PZ21ZC174/ke17ZwdGBToddI8pDm48kBtpJ0h6oTA_T7DonTC8zFdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIBqmMCQ1OP129tpEIJko8bi_9nfbnt8dRsNvtvnXdL8M/images.png',
                given_name: givenName,
                family_name: familyName,
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
    ).catch(err=> {
        return res.status(BAD_REQUEST).json({"decription": "username không tồn tại ", "error": err})
    })

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
    // chỗ này nếu sửa lại if (userinfo){
    //     for(i=0;i<1000;i++){

    //     }
    //     return res.json(userInfo)
    // }
    // return res.send("hehe")
    // thì hehe sẽ chạy trước( đây 1 vấn đề bất đồng bộ trong js)
    // nên cần else để tránh việc này 
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

exports.updateAccount = (req,res)=>{
    // hình ảnh sẽ up sau vif chưa tìm được host lưu trữ
    var {givenName, familyName, username, biography, className, faculty}=req.body
    //var pciture = req.files;
    var {userId} = req.params
    if(userId){
        data ={
            given_name:givenName,
            family_name:familyName,
            fullname: `${givenName} ${familyName}`,
            username:username,
            biography:biography,
            className:className,
            faculty:faculty,
            //picture:picrute
        }
        // newAccount =await account.findByIdAndUpdate(userId, data,  {new: true}).exec()
        account.findByIdAndUpdate(userId, data,  {new: true})
        .then(user=>{
                return res.json(user)
        })
        .catch((err)=>{
            res.json({"decription": GET_SOME_ERROR_WHEN_UPDATE, "error": err})
        })
    }

}

// dùng async await vì promise và funtion callback hell
exports.changePassword =async(req,res)=>{
    var{newPassword, oldPassword} = req.body
    var{userId} = req.params
    if (oldPassword){
        currentAccount = await account.findById(userId).exec()
        if(currentAccount){
            if(await bcrypt.compare(oldPassword, currentAccount.password)){
                if (newPassword === oldPassword){
                    return res.json({"decription":NOT_THING_CHANGE})
                }
                hashedPass = await bcrypt.hash(newPassword, 10)
                if(hashedPass){
                    currentAccount.password = hashedPass
                    currentAccount.save()
                    return res.json(currentAccount)
      
                }
                else{
                    return res.json({
                        error:err
                    })
                }
            }
            else{
                return res.json({"decription":"wrong password"})
            }
        }
    
    }

}

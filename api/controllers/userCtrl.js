const { BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE } = require('../../library/constant')

const account = require('../../models/user')
const bcrypt = require("bcryptjs")
const fs = require('fs')
const jwt = require("jsonwebtoken")
const {cloudinary} = require("../../library/cloundinary")

const {OAuth2Client} = require("google-auth-library")
const { response } = require('express')
const { JWT_SECRET } = process.env
const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID)

exports.register = (req, res) => {
    var { givenName, familyName, username, password } = req.body;
    account.findOne({ username: username }, (err, data) => {
        if (data) {
            return res.json({ "description": "username exist" })
        }

        bcrypt.hash(password, 10, (err, hashedPass) => {
            if (err) {
                return res.json({
                    error: err
                })
            }

            let newAccount = new account({
                fullname: `${givenName} ${familyName}`,
                picture: 'https://images.squarespace-cdn.com/content/v1/5930dc9237c5817c00b10842/1557979868721-ZFEVPV8NS06PZ21ZC174/ke17ZwdGBToddI8pDm48kBtpJ0h6oTA_T7DonTC8zFdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIBqmMCQ1OP129tpEIJko8bi_9nfbnt8dRsNvtvnXdL8M/images.png',
                givenName: givenName,
                familyName: familyName,
                username: username,
                password: hashedPass,
            })
            newAccount.save()
                .then((data) => {
                    return res.json(data)
                })
                .catch(e => console.log(e))

        })
    })

}

exports.login = (req, res) => {
    var { username, password } = req.body
    if (!username) {
        return res.status(BAD_REQUEST).json({ "description": "thiếu username" })
    }
    if (!password) {
        return res.status(BAD_REQUEST).json({ "description": "thiếu password" })
    }
    account.findOne({ username: username }).then(
        account => {
            bcrypt.compare(password, account.password, (err, result) => {
                if (err) {
                    res.json({ error: err })
                }
                if (result) {
                    let token = jwt.sign({ id: account._id }, JWT_SECRET, { expiresIn: '4h' })
                    console.log(token)
                    return res.json({
                        "token": token,
                        "userInfo": account
                    })
                }
                else {
                    return res.status(BAD_REQUEST).json({ "description": "Sai mật khẩu " })
                }
            })

        }
    ).catch(err => {
        return res.status(BAD_REQUEST).json({ "description": "username không tồn tại ", "error": err })
    })

}

exports.oauth2 = (req, res) => {
    var {tokenId} = req.body
    client.verifyIdToken({
        idToken: tokenId, 
        audience: CLIENT_ID
    })
    .then((response)=>{
        email = response.payload.email
        if(!email.includes("@student.tdtu.edu.vn")){
            return res.status(BAD_REQUEST).json({
                "error":"Login fail",
                "description":"Chỉ có thể sử dụng email có đuôi @student.tdtu.edu.vn để đăng nhập"
            })
        } 
        else{
            account.findOne({username: email})
            .then((accountInfo)=>{
                if(!accountInfo){
                    let newAccount = new account({
                        fullname: response.payload.name,
                        picture:  response.payload.picture,
                        givenName:  response.payload.given_name,
                        familyName:  response.payload.family_name,
                        username:  response.payload.email,
                    })
                    newAccount.save()
                    .then(newAccount=>{
                        console.log(newAccount)
                        let token = jwt.sign({ id: newAccount._id }, JWT_SECRET, { expiresIn: '4h' })
                        return res.json({
                            "token": token,
                            "userInfo": newAccount
                        })
                    })
                }
                else{
                    let token = jwt.sign({ id: accountInfo._id }, JWT_SECRET, { expiresIn: '4h' })
                    return res.json({
                        "token": token,
                        "userInfo": accountInfo
                    })
                }
            })
            .catch(err=>{
                return res.send(err)
            })
        }
    })

}

exports.detail = (req, res) => {
    var  userId  = req.userId

    // kiểm tra id của user bằng cách lấy id sau khi decode của bearer token 

    // chỗ này nếu sửa lại if (userinfo){
    //     for(i=0;i<1000;i++){

    //     }
    //     return res.json(userInfo)
    // }
    // return res.send("hehe")
    // thì hehe sẽ chạy trước( đây 1 vấn đề bất đồng bộ trong js)
    // nên cần else để tránh việc này 
    account.findById(userId, (err, userInfo) => {
        // kiểm tra thêm trong này cho chắc 
        if (err) {
            // return res.json({"description":USER_NOT_FOUND})
            return res.json({ "description": USER_NOT_FOUND })
        }
        else {
            return res.json({
                "id": userInfo._id,
                "givenName": userInfo.givenName,
                "familyName": userInfo.familyName,
                "fullname": userInfo.fullname,
                "username": userInfo.username,
                "biography": userInfo.biography,
                "className": userInfo.className,
                "faculty": userInfo.faculty,
                "picture":userInfo.picture

            })
        }

    })

}

exports.updateAccount = (req, res) => {
    // console.log("da vao ", req.body, req.file)
    // hình ảnh sẽ up sau vif chưa tìm được host lưu trữ


    // TODO : CHINRH LAIJ NEEUS KO COS ANHR THIF KO CAAPJ NHAATJ ANHR 
    var { givenName, familyName, username, biography, className, faculty } = req.body
    var picture = req.file
    var {userId} = req.params

    cloudinary.uploader.upload(picture.path, {folder:userId})
    .then((imageAfterUploadInfo)=>{
        fs.unlinkSync(picture.path)
        data = {
            givenName: givenName,
            familyName: familyName,
            fullname: `${givenName} ${familyName}`,
            username: username,
            biography: biography,
            className: className,
            faculty: faculty,
            picture:imageAfterUploadInfo.url
        }
        // newAccount =await account.findByIdAndUpdate(userId, data,  {new: true}).exec()
        account.findByIdAndUpdate(userId, data, { new: true })
            .then(user => {
                return res.json(user)
            })
            .catch((err) => {
                res.json({ "description": GET_SOME_ERROR_WHEN_UPDATE, "error": err })
            })
    })

    

}

// dùng async await vì promise và funtion callback hell
exports.changePassword = async (req, res) => {
    var { newPassword, oldPassword } = req.body
    var userId = req.userId
    if (oldPassword) {
        currentAccount = await account.findById(userId).exec()
        if (currentAccount) {
            if (await bcrypt.compare(oldPassword, currentAccount.password)) {
                if (newPassword === oldPassword) {
                    return res.json({ "description": NOT_THING_CHANGE })
                }
                hashedPass = await bcrypt.hash(newPassword, 10)
                if (hashedPass) {
                    currentAccount.password = hashedPass
                    currentAccount.save()
                    return res.json(currentAccount)

                }
                else {
                    return res.json({
                        error: err
                    })
                }
            }
            else {
                return res.json({ "description": "wrong password" })
            }
        }

    }

}

exports.profile = (req, res) => {
    const {userId} = req.params
    const userIdCurrentLogin = req.userId
    account.findById(userId, (err, profile) => {
        // kiểm tra thêm trong này cho chắc 
        if (err) {
            // return res.json({"description":USER_NOT_FOUND})
            return res.json({ "description": USER_NOT_FOUND })
        }
        else {
            profile = profile.toJSON()
            console.log("da vao ", userIdCurrentLogin, userId)
            if(userIdCurrentLogin === userId){
                profile.isCurrentUserLoginPage = true

            }
            else{
                profile.isCurrentUserLoginPage = false
            }
            return res.json(profile)
        }

    })
} 

exports.findUser = (req, res)=>{
    var {name} = req.params
    account.find({$or:[{fullname:{$regex: name, $options:'i'}}, {username:{$regex: name, $options:'i'}} ]})
    .then((accountInfos)=>{
        return res.json(accountInfos)
    })
    .catch((err)=>{
        return res.send(err.name)
    })
}
const { BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE } = require('../../library/constant')

const account = require('../../models/user')
const friendRequest = require('../../models/friendRequest')
const bcrypt = require("bcryptjs")
const fs = require('fs')
const jwt = require("jsonwebtoken")
const { cloudinary } = require("../../library/cloundinary")

const { OAuth2Client } = require("google-auth-library")
const { response } = require('express')
const { JWT_SECRET } = process.env
const CLIENT_ID = '100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
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
    if (!username || !password) {
        return res.status(BAD_REQUEST).json({ "description": "Vui lòng nhập đầy đủ thông tin" })
    }
    account.findOne({ username: username }).then(
        account => {
            bcrypt.compare(password, account.password, (err, result) => {
                if (err) {
                    res.json({ error: err })
                }
                if (result) {
                    let token = jwt.sign({ id: account._id }, JWT_SECRET, { expiresIn: '4h' })
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
        return res.status(BAD_REQUEST).json({ "description": "Tài khoản không tồn tại ", "error": err })
    })

}

exports.oauth2 = (req, res) => {
    var { tokenId } = req.body
    client.verifyIdToken({
        idToken: tokenId,
        audience: CLIENT_ID
    })
        .then((response) => {
            email = response.payload.email
            if (!email.includes("@student.tdtu.edu.vn")) {
                return res.status(BAD_REQUEST).json({
                    "error": "Login fail",
                    "description": "Chỉ có thể sử dụng email có đuôi @student.tdtu.edu.vn để đăng nhập"
                })
            }
            else {
                account.findOne({ username: email })
                    .then((accountInfo) => {
                        if (!accountInfo) {
                            let newAccount = new account({
                                fullname: response.payload.name,
                                picture: response.payload.picture,
                                givenName: response.payload.given_name,
                                familyName: response.payload.family_name,
                                username: response.payload.email,
                            })
                            newAccount.save()
                                .then(newAccount => {
                                    let token = jwt.sign({ id: newAccount._id }, JWT_SECRET, { expiresIn: '4h' })
                                    return res.json({
                                        "token": token,
                                        "userInfo": newAccount
                                    })
                                })
                        }
                        else {
                            let token = jwt.sign({ id: accountInfo._id }, JWT_SECRET, { expiresIn: '4h' })
                            return res.json({
                                "token": token,
                                "userInfo": accountInfo
                            })
                        }
                    })
                    .catch(err => {
                        return res.send(err)
                    })
            }
        })

}

exports.detail = (req, res) => {
    var userId = req.userId

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
            return res.json(userInfo)
            // return res.json({
            //     "id": userInfo._id,
            //     "givenName": userInfo.givenName,
            //     "familyName": userInfo.familyName,
            //     "fullname": userInfo.fullname,
            //     "username": userInfo.username,
            //     "biography": userInfo.biography,
            //     "className": userInfo.className,
            //     "faculty": userInfo.faculty,
            //     "picture":userInfo.picture

            // })
        }

    })

}

exports.updateAccount = async (req, res) => {
    // console.log("da vao ", req.body, req.file)
    // hình ảnh sẽ up sau vif chưa tìm được host lưu trữ


    // TODO : CHINRH LAIJ NEEUS KO COS ANHR THIF KO CAAPJ NHAATJ ANHR 
    var { givenName, familyName, username, biography, className, faculty, birthday, phone, gender } = req.body
    var picture = null
    var backgroundPicture = null
    if (req.files.image) {
        picture = req.files.image[0]
    }
    if (req.files.backgroundPicture) {
        backgroundPicture = req.files.backgroundPicture[0]
    }
    var { userId } = req.params

    var backgroundPictureCloundId = null
    var pictureCloundId = null
    if (picture) {
        var pictureInCloud = await cloudinary.uploader.upload(picture.path, { folder: userId })
        fs.unlinkSync(picture.path)
        var pictureUrl = pictureInCloud.url
        pictureCloundId = pictureInCloud.public_id
    }
    if (backgroundPicture) {
        var backgroundPictureInCloud = await cloudinary.uploader.upload(backgroundPicture.path, { folder: userId })
        fs.unlinkSync(backgroundPicture.path)
        var backgroundPictureUrl = backgroundPictureInCloud.url
        backgroundPictureCloundId = backgroundPictureInCloud.public_id
    }

    var userInfo = await account.findById(userId)

    if (backgroundPicture && userInfo.backgroundPictureId) {
        await cloudinary.uploader.destroy(userInfo.backgroundPictureId)
    }
    if (picture && userInfo.pictureId) {
        await cloudinary.uploader.destroy(userInfo.pictureId)
    }
    if (!givenName) {
        var givenName = userInfo.givenName
    }
    if (!familyName) {
        var familyName = userInfo.familyName
    }
    if (!username) {
        var username = userInfo.username
    }
    if (!biography) {
        var biography = userInfo.biography
    }
    if (!className) {
        var className = userInfo.className
    }
    if (!faculty) {
        var faculty = userInfo.faculty
    }
    if (!birthday) {
        var birthday = userInfo.birthday
    }
    if (!phone) {
        var phone = userInfo.phone
    }
    if (!gender) {
        var gender = userInfo.gender
    }
    if (!picture) {
        var pictureUrl = userInfo.picture
    }
    if (!backgroundPicture) {
        var backgroundPictureUrl = userInfo.backgroundPicture
    }

    data = {
        givenName: givenName,
        familyName: familyName,
        fullname: `${givenName} ${familyName}`,
        username: username,
        biography: biography,
        className: className,
        faculty: faculty,
        birthday: birthday,
        phone: phone,
        gender: gender,
        picture: pictureUrl,
        backgroundPicture: backgroundPictureUrl,
        backgroundPictureId: backgroundPictureCloundId,
        pictureId: pictureCloundId
    }
    // newAccount =await account.findByIdAndUpdate(userId, data,  {new: true}).exec()
    account.findByIdAndUpdate(userId, data, { new: true })
        .then(user => {
            return res.json(user)
        })
        .catch((err) => {
            res.json({ "description": GET_SOME_ERROR_WHEN_UPDATE, "error": err })
        })
}

// dùng async await vì promise và funtion callback hell
exports.changePassword = async (req, res) => {
    let { newPassword, oldPassword } = req.body
    let userId = req.userId
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
                    return res.status(BAD_REQUEST).json({
                        error: err
                    })
                }
            }
            else {
                return res.status(BAD_REQUEST).json({ "description": "Sai mật khẩu!" })
            }
        }
    }
}

exports.createPassword = (req, res) => {
    let { newPassword } = req.body
    let userId = req.userId

    bcrypt.hash(newPassword, 10, (err, hashedPass) => {
        if (err) {
            return res.status(BAD_REQUEST).json({error: err})
        }
        account.findByIdAndUpdate(userId, {password: hashedPass}, { new: true })
            .then(user => {
                return res.json(user)
            })
            .catch((err) => {
                return res.status(BAD_REQUEST).json({ 'description': GET_SOME_ERROR_WHEN_UPDATE, 'error': err })
            })
    })
}

exports.profile = (req, res) => {
    const { userId } = req.params
    const userIdCurrentLogin = req.userId
    account.findById(userId, (err, profile) => {
        // kiểm tra thêm trong này cho chắc 
        if (err) {
            // return res.json({"description":USER_NOT_FOUND})
            return res.json({ "description": USER_NOT_FOUND })
        }
        else {
            profile = profile.toJSON()

            if (userIdCurrentLogin === userId) {
                profile.isCurrentUserLoginPage = true

            }
            else {
                profile.isCurrentUserLoginPage = false
            }
            friendRequest.findOne({ $or: [{ userRequest: userIdCurrentLogin, userReceiveId: userId }, { userRequest: userId, userReceiveId: userIdCurrentLogin }] })
                .then(friendRequestInfo => {
                    // friend status : false: đã gửi lời mời chưa được accept, true là bạn, null chưa là gì cả, other: chờ xác nhận 

                    if (friendRequestInfo == null) {
                        profile['friendStatus'] = null
                    }
                    else if (friendRequestInfo.status === true) {
                        profile['friendStatus'] = true
                    }
                    else if (friendRequestInfo.status === false) {
                        if (friendRequestInfo.userRequest == userIdCurrentLogin) // nếu người đang đăng nhập là người gửi request thì sẽ là đã gửi lời mời 
                        {
                            profile['friendStatus'] = false
                        }
                        else {
                            profile['friendStatus'] = 'other'
                        }
                    }
                    return res.json(profile)
                })



        }

    })
}

exports.findUser = (req, res) => {
    var { name } = req.params
    account.find({ $or: [{ fullname: { $regex: name, $options: 'i' } }, { username: { $regex: name, $options: 'i' } }] })
        .then((accountInfos) => {
            friendRequest.find({ $or: [{ userRequest: req.userId }, { userReceiveId: req.userId }] })
                .then(requestFriendInfos => {
                    const idUserReceiveRequest_requestInfo = {}
                    const idUserRequest_requestInfo = {}
                    for (var i = 0; i < requestFriendInfos.length; i++) {
                        requestFriendInfoJsons = requestFriendInfos[i].toJSON()
                        idUserReceiveRequest_requestInfo[requestFriendInfoJsons['userReceiveId']] = requestFriendInfoJsons
                        idUserRequest_requestInfo[requestFriendInfoJsons['userRequest']] = requestFriendInfoJsons
                    }
                    //{$or:[{userRequest: userIdCurrentLogin, userReceiveId: userId}, {userRequest: userId, userReceiveId: userIdCurrentLogin}]}
                    for (var i = 0; i < accountInfos.length; i++) {
                        accountInfos[i] = accountInfos[i].toJSON()

                        // chỗ này tách ra làm 2 để check với 2 mục đích:
                        // - tạo dict với 2 loại 1 là người đang onl là người gửi request, 2 là người đang onl là người được gửi request
                        if (accountInfos[i]._id in idUserReceiveRequest_requestInfo) {

                            // friend status : false: đã gửi lời mời chưa được accept, true là bạn, null chưa là gì cả
                            var status = idUserReceiveRequest_requestInfo[accountInfos[i]._id.toString()]['status']

                            if (!status) {
                                if (idUserReceiveRequest_requestInfo[accountInfos[i]._id.toString()]['userReceiveId'] == req.userId) // nếu người đanh online hiện tại là người nhận được lồi mời thì text sẽ là "xác nhận"
                                {
                                    accountInfos[i]['friendStatus'] = 'other'
                                }
                                else {
                                    accountInfos[i]['friendStatus'] = false
                                }

                            }
                            else {
                                accountInfos[i]['friendStatus'] = true
                            }
                        }
                        else if (accountInfos[i]._id in idUserRequest_requestInfo) {
                            var status = idUserRequest_requestInfo[accountInfos[i]._id.toString()]['status']

                            if (!status) {
                                if (idUserRequest_requestInfo[accountInfos[i]._id.toString()]['userReceiveId'] == req.userId) // nếu người đanh online hiện tại là người nhận được lồi mời thì text sẽ là "xác nhận"
                                {
                                    accountInfos[i]['friendStatus'] = 'other'
                                }
                                else {
                                    accountInfos[i]['friendStatus'] = false
                                }

                            }
                            else {
                                accountInfos[i]['friendStatus'] = true
                            }


                        }
                        else {
                            accountInfos[i]['friendStatus'] = null
                        }
                    }

                    return res.json(accountInfos)
                })

        })
        .catch((err) => {
            return res.send(err.name)
        })
}
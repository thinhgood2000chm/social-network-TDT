const { BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE } = require('../../library/constant')

const bcrypt = require('bcryptjs')

const AccountModel = require('../../models/user')

exports.getAllAccount = (req, res) => {
    AccountModel.find()
    .then(accounts => {
        return res.json(accounts)
    })
    .catch(e => console.log(e))
}

exports.updateAccount = (req, res) => {
    let { username, password } = req.body
    let { userId } = req.params

    bcrypt.hash(password, 10, (err, hashedPass) => {
        if (err) {
            return res.json({error: err})
        }
        newData = {
            username: username,
            password: hashedPass
        }

        AccountModel.findByIdAndUpdate(userId, newData, { new: true })
            .then(user => {
                return res.json(user)
            })
            .catch((err) => {
                if(err.code === 11000 && err.codeName === 'DuplicateKey')
                    return res.json({ 'description': err, 'error': 'Tên tài khoản đã tồn tại' })
                    
                return res.json({ 'description': GET_SOME_ERROR_WHEN_UPDATE, 'error': err })
            })
    })

}
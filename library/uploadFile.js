const multer = require('multer');
var uploadFile =
    multer({
        dest: './public/upload', fileFilter: (req, file, callback) => {// kiểm tra nếu là ảnh thì cho phép upload vs giá tri mimetype là image
            if (file.mimetype.startsWith('image/')) {
                callback(null, true)
            }
            else
                callback(null, false)
        }, limits: { fileSize: 5000000000 }
    })

module.exports = uploadFile

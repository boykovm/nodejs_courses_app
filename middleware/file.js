const multer = require('multer')
const dateFormat = require('dateformat')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        let date = new Date()
        date = dateFormat(date, "yyyymmdd_HMMssl")
        cb(null, date + '-' + file.originalname)
    }
})

const allowedTypes =['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter
})

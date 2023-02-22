const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('tmp'));
    },
    filename: function (req, file, cb) {
        const [, extension] = file.originalname.split('.');
        cb(null, `${uuidv4()}.${extension}`);
    }
});

const uploadMiddleware = multer({
    storage: storage
});

module.exports = {
uploadMiddleware,
}
const multer = require('multer')

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, './public/cable/');
    },
    filename: function (req, file, cb) {
        console.log('in utils', file)
        let ext = file.originalname.split('.');
        ext = ext[ext.length - 1];
        const filename = "_" + Date.now() + "." + ext;
        cb(null, filename);
    }
})



const upload = multer({storage})

module.exports = {
    upload
}
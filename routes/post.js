const express = require('express');
const { createPost, addImageController, getPostData } = require('../Controllers/postController');
const verifyUser = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
})

var upload = multer({ storage: storage })
router.post('/createpost', verifyUser, createPost)
router.post('/addImage', verifyUser, upload.single('img'), addImageController) // img - passig from frontend
router.get('/getPostData', getPostData)

module.exports = router;   
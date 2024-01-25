const express = require('express');
const router = express.Router();
const { createUser, getAllUser, updateData, deleteUser, login, logout, changePassword, updateAvatar } = require('../controller/user.controller');
const { verfyToken } = require('../middleware/auth');
const { upload } = require('../middleware/multer');

router.route('/registerUser').post(upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]),createUser)
router.route('/getAllUser').get(verfyToken,getAllUser)
router.route('/updateData/:id').put(verfyToken,updateData)
router.route('/deleteUser/:id').delete(verfyToken,deleteUser)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/changePassword/:id').post( verfyToken,changePassword)
router.route('/updateAvatar').patch(verfyToken,upload.single("avatar"),updateAvatar)
module.exports = router
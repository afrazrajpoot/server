const express = require('express');
const router = express.Router();
const { createUser, getAllUser, updateData, deleteUser, login, logout, changePassword } = require('../controller/user.controller');
const { verfyToken } = require('../middleware/auth');

router.route('/registerUser').post(createUser)
router.route('/getAllUser').get(verfyToken,getAllUser)
router.route('/updateData/:id').put(verfyToken,updateData)
router.route('/deleteUser/:id').delete(verfyToken,deleteUser)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/changePassword/:id').post( verfyToken,changePassword)
module.exports = router
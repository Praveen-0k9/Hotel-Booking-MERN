const express = require('express');
const router = express.Router();
const os = require('os');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  register,
  login,
  logout,
  googleLogin,
  uploadPicture,
  updateUserDetails,
} = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google/login').post(googleLogin)
router.route('/upload-picture').post(upload.single('picture'), uploadPicture)
router.route('/update-user').put(updateUserDetails)
router.route('/logout').get(logout);


module.exports = router;

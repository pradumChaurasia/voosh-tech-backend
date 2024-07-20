const express = require('express');

const { register, login, googleLogin } = require('../controller/authController.js');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);



module.exports = router;

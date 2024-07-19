const express = require('express');
const passport = require('passport');
const { register, login, googleLogin } = require('../controller/authcontroller');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);

// router.get('/googlesignin', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback', passport.authenticate('google', {
//     failureRedirect: '/sigin',
// }), (req, res) => {
//     res.redirect('/dashboard');
// });

module.exports = router;

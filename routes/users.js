const express = require('express');

const router = express.Router();

const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const users = require('../Controllers/users')


router.route('/register')
    .get(users.renderRegister)
    .post(users.Register);

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureRedirect: '/login' }), users.Login);

router.get('/logout', users.LogOut);

module.exports = router;
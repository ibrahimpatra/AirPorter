const express = require('express');
const passport = require('passport');
const router = express.Router()
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')

const users = require('../controllers/users')

router.route('/register')
    .get( users.signupform)
    .post( catchAsync(users.signup))

router.route('/login')
    .get(users.loginform)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;
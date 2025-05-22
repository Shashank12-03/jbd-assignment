const {Router} = require('express');
const { check } = require('express-validator');
const { signUp, loginUser } = require('../controllers/authentication.js');

const router = Router();

router.post('/login',[
    check('email').isEmail().withMessage('Email is not valid')
],loginUser);

router.post('/signup', [
    check('email').isEmail().withMessage('Email is not valid'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('userName').notEmpty().withMessage('Name is required'),
],signUp);

module.exports = router;
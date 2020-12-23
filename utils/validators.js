const {body} = require('express-validator/check')
const User = require('../models/user')
const bcrypt = require('bcryptjs')








exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Input correct email')
        .custom( async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('This email already exists')
                }
            } catch (err) {
                console.log(err)
            }
        })
        .normalizeEmail(),
    body('password', 'min password length is 6 symbols')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must be same')
        }
        return true
        })
        .trim(),
    body('name').isAlpha().withMessage('Name must contain only chars')

]



exports.loginValidators = [
    body('email')
        .isEmail().withMessage('Input correct email')
        .custom( async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (!user) {
                    return Promise.reject('This email was`n registered')
                }
            } catch (err) {
                console.log(err)
            }
        }),
    body('password', 'you had entered incorrect password, try again')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim()
]


exports.courseValidators = [
    body('title')
        .isLength({min: 3}).withMessage('Title length must be longer than 3 symbols')
        .trim(),
    body('price')
        .isNumeric({minNumbers: 0}).withMessage('Input correct price'),
    body('image', 'Input correct image`s url')
        .isURL()
]

const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator/check')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
// const regEmail = require('../emails/registration')
const {registerValidators, loginValidators} = require('../utils/validators')
const router = Router()

const User = require('../models/user')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))



router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        LoginError: req.flash('LoginError'),
        RegisterError: req.flash('RegisterError')
    })
})

router.get('/logout', async (req, res) => {
    // req.session.isAuthenticated = false
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const  {email, password} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                title: 'Login',
                isLogin: true,
                data: {
                    email: req.body.email
                },
                LoginError: errors.array()[0].msg
            })
        }

        const candidate = await User.findOne({email})

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                const user = candidate
                req.session.user = user
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err){
                        throw err
                    } else {
                        res.redirect('/')
                    }
                })
            } else {
                return res.status(422).render('auth/login', {
                    title: 'Login',
                    isLogin: true,
                    data: {
                        email: req.body.email
                    },
                    LoginError: 'Wrong password'
                })
            }
        } else {
            return res.status(422).render('auth/login', {
                title: 'Login',
                isLogin: true,
                data: {
                    email: req.body.email
                },
                LoginError: 'User with this email is not exists'
            })
        }
    } catch (e) {
        console.log(e)
    }

})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            req.flash('RegisterError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email,
            name,
            password: hashPassword,
            cart: {items: []}
        })
        await user.save()
            // await transporter.sendMail(regEmail(email))
        res.redirect('/auth/login#login')
    } catch (e) {
        console.log(e)
    }
})



module.exports = router

const {Router} = require('express');
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator/check')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'add page',
        isAdd: true
    });
});

router.post('/', auth, courseValidators, async (req, res) => {
    const  {title, price, image} = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'add page',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.image
            }
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.image,
        userID: req.user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router;

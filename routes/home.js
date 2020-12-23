const {Router} = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'index page',
        isHome: true
    });
});

module.exports = router

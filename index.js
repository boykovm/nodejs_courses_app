const express = require('express');
const path= require('path');
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const favicon = require('serve-favicon')
// const helmet = require('helmet')
// const helmetCsp = require('helmet-csp')
const compression = require('compression')
const exphbs = require('express-handlebars');
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home');
const addRouter = require('./routes/add');
const coursesRouter = require('./routes/courses')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const Handlebars = require('handlebars')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const varMiddleware = require('./middleware/variables')
const userMiddelware = require('./middleware/user')
const errorHandlre = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys')

const app = express();

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'view');

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('5fda4e4d51a5b31b242f79b2')
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e)
//     }
// })

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
// app.use(helmet())
// app.use(helmetCsp({}))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddelware)

app.use('/', homeRoutes);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandlre)


const PORT = process.env.PORT || 80

async function start () {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })

        app.listen(PORT, () => {
            console.log(`server is runing on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()

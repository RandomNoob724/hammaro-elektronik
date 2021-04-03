const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const dotenv = require('dotenv').config();

const app = express()

//routers
const serviceRouter = require('./routers/serviceRouter')
const dashboardRouter = require('./routers/dashboardRouter')
const staffRouter = require('./routers/staffRouter')
const newsRouter = require('./routers/newsRouter')
const errorReportRouter = require('./routers/errorReportRouter')

//hardcoded login credentials
const codedUsername = 'Admin'
const codedPassword = '123' //this should be a hashed password later

const SALT_ROUNDS = 10

const csrfProtection = csrf({ cookie: true })

app.use(bodyParser.urlencoded({
    extended: false
}))

app.engine('.hbs', handlebars({ extname: '.hbs' }));

app.set('view engine', '.hbs')

app.use("/public", express.static(__dirname + '/public'))

app.use(expressSession({
    secret: "paoifhdohfosdfjaodjf",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore(),
    cookie: { maxAge: 60 * 60 * 24 * 1000 }
}))

app.use(cookieParser())

app.use(csrfProtection)

app.use(function (request, response, next) {
    response.locals.isLoggedIn = request.session.isLoggedIn
    response.locals.csrfToken = request.csrfToken()
    next()
})

app.use(function (error, request, response, next) {
    if (error.code === 'EBADCSRFTOKEN') {
        response.status(403).render('error403.hbs')
    } else {
        next()
    }
})

app.use('/news', newsRouter)
app.use('/service', serviceRouter)
app.use('/dashboard', dashboardRouter)
app.use('/staff', staffRouter)
app.use('/reporterror', errorReportRouter)

app.get('/', function (request, response) {
    response.render('home.hbs')
})

app.get('/login', function (request, response) {
    if (request.session.isLoggedIn) {
        response.redirect('/')
    } else {
        response.render('login.hbs')
    }
})

app.post('/login', function (request, response) {
    const username = request.body.username
    const password = request.body.password
    if (username == codedUsername && password == codedPassword) {
        request.session.isLoggedIn = true
        response.redirect('/')
    } else {
        const errorModel = {
            loginError: "Non valid login"
        }
        response.render('login.hbs', errorModel)
    }
})

app.post('/logout', function (request, response) {
    request.session.isLoggedIn = false
    response.redirect('/')
})

app.listen(process.env.PORT, function () {
    console.log("Listening on port 3000")
})
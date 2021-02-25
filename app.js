const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)

//routers
const serviceRouter = require('./routers/serviceRouter')
const dashboardRouter = require('./routers/dashboardRouter')
const staffRouter = require('./routers/staffRouter')
const newsRouter = require('./routers/newsRouter')

//hardcoded login credentials
const codedUsername = 'Admin'
const codedPassword = '123' //this should be a hashed password later

const SALT_ROUNDS = 10

app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs')

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(expressSession({
    secret: "paoifhdohfosdfjaodjf",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore(),
    cookie: { maxAge: 60 * 60 * 24 * 1000 }
}))

app.use(function (request, response, next) {
    response.locals.isLoggedIn = request.session.isLoggedIn
    next()
})

app.use('/news', newsRouter)
app.use('/service', serviceRouter)
app.use('/dashboard', dashboardRouter)
app.use('/staff', staffRouter)

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

app.post('/logout', function(request, response){
    request.session.isLoggedIn = false
    response.redirect('/')
})

app.listen(3000, function () {
    console.log("Listening on port 3000")
})
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
const accountRouter = require('./routers/accountRouter')

//hardcoded login credentials
const username = 'Admin'
const password = '123' //this should be a hashed password later

app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs')

app.use(express.static(__dirname + '/public'))

app.use('/account', accountRouter)
app.use('/service', serviceRouter)
app.use('/dashboard', dashboardRouter)

app.get('/', function(request,response){
    response.render('home.hbs')
})

app.listen(3000, function() {
    console.log("Listening on port 3000")
})
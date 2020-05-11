const express = require('express')
const app = express()
const handlebars = require('express-handlebars')

app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs')

app.get('/', function(request,response){
    response.render('home')
})

app.listen(3000, function() {
    console.log("Listening on port 3000")
})
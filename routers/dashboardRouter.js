const express = require('express')

const router = express.Router()

router.get('/', function(request, response){
    //add authentication and authorization
    response.render('dashboard.hbs')
})

router.get('/service', function (request, response){
    //add authentication here too
    response.render('addservice.hbs')
})

router.get('/addnews', function (request, response){
    response.render('addnews.hbs')
})
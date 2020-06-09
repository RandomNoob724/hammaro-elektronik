const express = require('express')

const router = express.Router()

router.get('/forgot-password', function (request, response){
    response.send("this may not be used")
})

router.get('/login', function (request, response){
    response.send("Hello login")
})
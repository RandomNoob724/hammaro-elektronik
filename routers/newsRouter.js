const express = require('express')
const router = express.Router()

router.get('/create', function(request, response){
    response.send("Create page should be here, don't forget to add security this time idiot")
})

router.post('/create', function(request, response){

})

router.post('/remove', function(request, response){

})

router.get('/update', function(request, response){
    
})

router.post('/update', function(request, response){

})

module.exports = router
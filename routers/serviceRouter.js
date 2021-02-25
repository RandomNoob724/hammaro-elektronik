const express = require('express')
const multer = require('multer')
const db = require('../db')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null,__dirname+'/upload/service');
    },
    filename: function (request, file, callback) {
        let extension = null
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            callback(true, file.originalname)
        } else {
            callback(false)
        }
    }
})

const fileFilter = function (request, file, callback) {
    if (file.mimetype == 'image/jpeg') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

const upload = multer({dest: "/upload/service", storage: storage, fileFilter: fileFilter})

router.use(express.static(__dirname+"/routers/upload/service"))

//Used when checking the services page
router.get("/", function (request, response) {
    db.getAllServices(function (error, services) {
        if (error) {
            response.status(500), render('error500.hbs')
        } else {
            const model = {
                serviceList: services
            }
            response.render('service.hbs', model)
        }
    })
})

//Used when checking for is logged in everything below this should be checked for login
router.use(function (request, response, next) {
    if (request.session.isLoggedIn) {
        next()
    } else {
        response.send("Error not logged in")
    }
})

router.get('/manage', function(request, response){
    db.getAllServices(function(error, services){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            const model = {
                serviceList: services
            }
            response.render('manage-services.hbs', model)
        }
    })
})

//Called when going to the Add Services page
router.get('/add', function (request, response) {
    const validationError = []
    if (request.session.isLoggedIn) {
        response.render('add-service.hbs')
    } else {
        validationError.push("You have to be logged in to access this part")
        const model = {
            validationError
        }
        response.render("login.hbs", model)
    }
})

//called when adding a new service through the dashboard
router.post('/add', upload.single('myFile'), function (request, response) {
    const title = request.body.serviceTitle
    const description = request.body.description
    let imageLink = ""

    if(request.file) {
        imageLink = request.file.originalname
    }

    const serviceModel = {
        title: title,
        description
    }
    db.addNewService(serviceModel, function (error) {
        if (error) {
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/service')
        }
    })
})

//Delete request for removing a specific service
router.post('/:id/delete', function(request, response){
    const id = request.params.id

    db.removeServiceWithId(id, function(error){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/service/manage')
        }
    })
})

router.get('/update/:id', function(request, resonse){
    const id = request.params.id

    db.getServiceWithId(id, function(error, serviceObject){
        if(error){
            response.status(500).render('error500.hbs');
        } else {
            const model = {
                serviceObject
            }
            resonse.render('edit-service.hbs', model)
        }
    })
})

router.post('/update/:id', function(request, response){
    const id = request.params.id
    const serviceInfo = {
        id,
        title: request.body.title,
        description: request.body.description
    }
    db.updateService(serviceInfo, function(error){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/service/manage')
        }
    })
})

module.exports = router
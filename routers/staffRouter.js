const express = require('express')
const multer = require('multer')

const db = require('../db')

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null,__dirname+'/upload/staff');
    },
    filename: function (request, file, callback) {
        let extension = null
        if (file.mimetype == 'image/jpeg') {
            extension = ".jpg"
        }
        callback(null, file.originalname)
    }
})

const fileFilter = function (request, file, callback) {
    if (file.mimetype == 'image/jpeg') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

const upload = multer({dest: "/upload/staff", storage: storage, fileFilter: fileFilter})

const router = express.Router()

router.use(express.static(__dirname+"/routers/upload/staff"))

router.get('/', function (request, response) {
    db.getAllStaff(function (error, staffList) {
        if (error) {
            response.status(500).render('error500.hbs')
        } else {
            const model = {
                staffList
            }
            response.render("staff.hbs", model)
        }
    })
})

router.use(function(request, response, next){
    if(request.session.isLoggedIn){
        next()
    } else {
        response.status(401).render('error401.hbs')
    }
})

router.get('/manage', function(request, response){
    db.getAllStaff(function(error, staff){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            const model = {
                staffList: staff
            }
            response.render('manage-staff.hbs', model)
        }
    })
})

//Get the form to fill out add new staff member
router.get('/add', function (request, response) {
    response.render('add-staff.hbs')
})

//
router.post('/add', upload.single('myFile'), function (request, response) {
    let imageLink = ""
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const profession = request.body.profession
    if (request.file) {
        imageLink = request.file.originalname
    }

    const staffValues = {
        firstName,
        lastName,
        profession,
        imageLink
    }

    db.addStaffMember(staffValues, function (error) {
        if (error) {
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/staff')
        }
    })
})

router.post('/:id/delete', function(request, response){
    const id = request.params.id
    db.removeStaffMemberById(id, function(error){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/staff/manage')
        }
    })
})

router.get('/update/:id', function(request, response){
    const id = request.params.id
    db.getStaffById(id, function(error, staffMember){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            const model = {
                staffObject: staffMember
            }
            response.render('edit-staff.hbs', model)
        }
    })
})

router.post('/update/:id', function(request, response){
    const id = request.params.id
    const staffInfo = {
        id,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        profession: request.body.profession
    }
    db.updateStaffMemeberById(staffInfo, function(error){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/staff')
        }
    })
})

module.exports = router
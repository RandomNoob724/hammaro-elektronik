const express = require('express')
const multer = require('multer')

const db = require('../db')

const router = express.Router()

router.get('/', function(request, response){
    db.getAllStaff(function(error, staffList){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            console.log(staffList);
            const model = {
                staffList
            }
            response.render("staff.hbs", model)
        }
    })
})

//Get the form to fill out add new staff member
router.get('/add', function(request, response){
    response.render('add-staff.hbs')
})

//
router.post('/add', function(request, response){
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const imageLink = ""
    if(request.file){
        imageLink = request.file.originalname
    }
    const staffValues = {
        firstName,
        lastName,
        imageLink
    }
    db.addStaffMember(staffValues, function(error){
        if(error){
            response.status(500).render('error500.hbs')
        }
    })
    response.redirect('/staff')
})

module.exports = router
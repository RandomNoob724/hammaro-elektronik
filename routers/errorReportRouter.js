const express = require('express');
const mailService = require('../services/mailService');

const router = express.Router();

router.get('/', (request, response) => {
    response.render('error-report.hbs')
})

router.post('/sendMail', (request, response) => {
    const data = {
        description: request.body.problemDescription,
        name: request.body.personName,
        companyName: request.body.companyName,
        contactEmail: request.body.contactEmail
    }
    mailService.sendMail(data)
    .then((result) => console.log(result))
    .catch(error => console.log(error))
    response.redirect('/');
})

module.exports = router
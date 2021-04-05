const express = require('express');
const mailService = require('../services/mailService');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', (request, response) => {
    response.render('error-report.hbs')
})

router.post('/sendMail', (request, response) => {
    const captchaValue = request.body['g-recaptcha-response']
    const secretKey = process.env.CAPTCHA_SERVER_SECRET
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaValue}`

    if(captchaValue === undefined || captchaValue === '' || captchaValue === null){
        response.render('error-report.hbs', {"success":false, "msg": "Please select captcha verification"})
    } else {
        fetch(verificationURL, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(captchaRes => {
            console.log(captchaRes)
            if(captchaRes.success !== undefined && !captchaRes.success){
                response.render('error-report.hbs', {"success":false, "msg": "Failed captcha verification"})
            }
            const data = {
                description: request.body.problemDescription,
                name: request.body.personName,
                companyName: request.body.companyName,
                contactEmail: request.body.contactEmail
            }
            mailService.sendMail(data)
            .then((result) => console.log(result))
            .catch(error => console.log(error))
            response.render('error-report.hbs',{"success":true, "msg": "Email sent"})
        })
    }
})

module.exports = router
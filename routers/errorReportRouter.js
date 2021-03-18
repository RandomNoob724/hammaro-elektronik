const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/', (request, response) => {
    response.render('error-report.hbs')
})

router.post('/sendMail', (request, response) => {
    const data = {
        description: request.body.problemDescription,
        name: request.body.personName,
        companyName: request.body.businessName
    }
    main(data).catch(console.error);
    response.redirect('/');
})

async function main(data) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Felanmälan från: " + data.companyName, // Subject line
        text: "Företagsnamn: " + data.companyName + "\nNamn: "+ data.name + "\nBeskrivning av problem: " + data.description, // plain text body
        html: "Företagsnamn: " + data.companyName + "\nNamn: "+ data.name + "\nBeskrivning av problem: " + data.description, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = router
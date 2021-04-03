const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

exports.sendMail = async function(data){
    try{
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                 type: 'OAuth2',
                 user: 'mappy.ateam@gmail.com',
                 clientId: process.env.CLIENT_ID,
                 clientSecret: process.env.CLIENT_SECRET,
                 refreshToken: process.env.REFRESH_TOKEN,
                 accessToken: accessToken
            }
        });

        let mailOptions = {
            from: "mappy.ateam@gmail.com <mappy.ateam@gmail.com>",
            to: "mappy.ateam@gmail.com",
            subject: "Support Ticket",
            text: `Företagsnamn: ${data.companyName}\nKontakt Email: ${data.contactEmail}\nNamn: ${data.name}\nBeskrivning av felanmälan: ${data.description}`
        };
        const result = await transporter.sendMail(mailOptions)
        return result
    }
    catch(error){
        return error
    }
}
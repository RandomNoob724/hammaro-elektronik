const express = require('express')

const router = express.Router()

//Beyond this part just put authentication stuff
router.use(function (request, response, next) {
    if (request.session.isLoggedIn) {
        next()
    } else {
        response.status(401).render('error401.hbs')
    }
})

router.get('/', function (request, response) {
    response.render('dashboard.hbs')
})

module.exports = router
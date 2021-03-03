const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    response.render('error-report.hbs')
})

module.exports = router
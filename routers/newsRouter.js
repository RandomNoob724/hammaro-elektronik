const express = require('express')
const db = require('../db')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null,__dirname+'/upload/news');
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

const upload = multer({dest: "/upload/news", storage: storage, fileFilter: fileFilter})

const router = express.Router()

router.get('/', function(request, response){
    db.getAllNews(function(error, newsList){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            const model = {
                newsList
            }
            response.render('news.hbs', model)
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
    db.getAllNews(function(error, newsList){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            const model = {
                newsList
            }
            response.render('manage-news.hbs', model)
        }
    })
})

router.get('/add', function(request, response){
    response.render("add-news.hbs")
})

router.post('/add', upload.single("myFile"), function(request, response){
    const title = request.body.newsTitle
    const description = request.body.newsDescription
    const newsInfo = {
        title, 
        description,
        //imageInfo
    }
    db.addNewsPost(newsInfo, function(error){
        if (error){
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/news')
        }
    })
})

router.post('/:id/delete', function(request, response){
    const id = request.params.id
    db.removeNewsPostWithId(id, function(error){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/news/manage')
        }
    })
})

router.get('/update/:id', function(request, response){
    const id = request.params.id
    db.getNewsPostById(id, function(error, newsObject){
        if (error){
            response.status(500).render('error500.hbs')
        } else {
            const model = {
                newsObject
            }
            response.render('edit-news.hbs', model)
        }
    })
})

router.post('/update/:id', function(request, response){
    const id = request.params.id
    const title = request.body.title
    const content = request.body.description

    const newsObject = {
        id,
        title,
        content
    }

    db.updateNewsPost(newsObject, function(error){
        if(error){
            response.status(500).render('error500.hbs')
        } else {
            response.redirect('/news/manage')
        }
    })
})

module.exports = router
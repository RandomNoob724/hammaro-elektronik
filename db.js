const sqlite = require('sqlite3')
const db = new sqlite.Database("Database.db")

db.run(`
    CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        imageLink TEXT,
        profession TEXT
    )
`);

db.run(`
        CREATE TABLE IF NOT EXISTS serviceType (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            imageLink TEXT
        )
`);

db.run(`
        CREATE TABLE IF NOT EXISTS newsPost (
            id INTEGER PRIMARY KEY,
            title TEXT,
            content TEXT,
            imageLink TEXT
        )
`);


//*STAFF
//When the admin or user wants to add a staff member this function is called to add the user with the right values to the database
exports.addStaffMember = function(staffValues ,callback){
    const query = "INSERT INTO staff (firstName, lastName, imageLink, profession) VALUES (?,?,?,?)"
    const values = [staffValues.firstName, staffValues.lastName, staffValues.imageLink, staffValues.profession]
    db.run(query, values, function(errors){
        const id = this.lastID
        callback(errors)
    })
}

exports.removeStaffMemberById = function(id, callback){
    const query = "DELETE FROM staff WHERE id=?"
    const values = [id]
    db.run(query, values, function(error){
        callback(error)
    })
}

exports.updateStaffMemeberById = function(staffInfo, callback){
    const query = "UPDATE staff SET firstName = ?, lastName = ?, profession = ? WHERE id = ?"
    const values = [staffInfo.firstName, staffInfo.lastName, staffInfo.profession, staffInfo.id]
    db.run(query, values, function(error){
        callback(error)
    })
}

//Used to get all of the staff members from the database
exports.getAllStaff = function (callback) {
    const query = "SELECT * FROM staff"
    db.all(query, function(error, staff){
        callback(error, staff)
    })
}

//This method is called when getting a staff memeber with a specific id number
exports.getStaffById = function (id, callback){
    const query = "SELECT * FROM staff WHERE id = ?"
    const values = [id]
    db.get(query, values, function(errors, staffMember){
        callback(errors, staffMember)
    })
}

//*SERVICES
exports.getAllServices = function(callback){
    const query = "SELECT * FROM serviceType"
    db.all(query, function(errors, result){
        callback(errors, result)
    })
}

exports.getServiceWithId = function(id, callback){
    const query = "SELECT * FROM serviceType WHERE id=?"
    const values = [id]
    db.get(query, values, function(error, service){
        callback(error,service)
    })
}

exports.addNewService = function(serviceInfo, callback){
    console.log(serviceInfo);
    const query = "INSERT INTO serviceType(title, description) VALUES (?,?)"
    const values = [serviceInfo.title, serviceInfo.description]
    db.run(query, values, function(errors){
        const id = this.lastID
        callback(errors)
    })
}

exports.removeServiceWithId = function(id, callback){
    const query = "DELETE FROM serviceType WHERE id = ?"
    const values = [id]
    db.run(query, values, function(error){
        callback(error)
    })
}

exports.updateService = function(serviceInfo, callback){
    const query = "UPDATE serviceType SET title = ?, description = ? WHERE id = ?"
    const values = [serviceInfo.title, serviceInfo.description, serviceInfo.id]
    db.run(query, values, function(error){
        callback(error)
    })
}



//*NEWS
exports.getAllNews = function(callback){
    const query = "SELECT * FROM newsPost"
    db.all(query, function(error, newsList){
        callback(error, newsList)
    })
}

exports.getNewsPostById = function(id, callback){
    const query = "SELECT * FROM newsPost WHERE id = ?"
    const values = [id]
    db.get(query, values, function(error, newsObject){
        callback(error, newsObject)
    })
}

exports.addNewsPost = function(newsInfo, callback){
    const query = "INSERT INTO newsPost (title, content) VALUES (?,?)"
    const values = [newsInfo.title, newsInfo.description]
    db.run(query, values, function(error){
        const id = this.lastID
        callback(error)
    })
}

exports.removeNewsPostWithId = function(id, callback){
    const query = "DELETE FROM newsPost WHERE id = ?"
    const values = [id]
    db.run(query, values, function(error){
        callback(error)
    })
}

exports.updateNewsPost = function(newsObject, callback){
    const query = "UPDATE newsPost SET title = ?, content = ? WHERE id = ?"
    const values = [newsObject.title, newsObject.content, newsObject.id]
    db.run(query, values, function(error){
        callback(error)
    })
}
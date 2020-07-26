const sqlite = require('sqlite3')
const db = new sqlite.Database("Database.db")

db.run(`
    CREATE TABLE IF NOT EXISTS staff (
        Id INTEGER PRIMARY KEY,
        firstName TEXT,
        lastName TEXT
    )
`);

db.run(`
        CREATE TABLE IF NOT EXISTS serviceType (
            title TEXT,
            description TEXT,
            img TEXT
        )
`);

db.run(`
        CREATE TABLE IF NOT EXISTS newsPost (
            title TEXT,
            content TEXT,
            img TEXT
        )
`);

//When the admin or user wants to add a staff member this function is called to add the user with the right values to the database
exports.addStaffMemeber = function(staffValues ,callback){
    const query = "INSERT (?, ?, ?) INTO staff"
    const values = [staffValues.id, staffValues.firstName, staffValues.lastName]
    db.run(query, values, function(errors){
        callback(errors)
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
    const query = "SELECT * FROM staff WHERE Id = ?"
    const values = [id]
    db.all(query, function(errors, staffMember){
        callback(errors, staffMember)
    })
}

//This method is used when getting a staff memeber with a specific full name
exports.getStaffByName = function(firstName, lastName, callback){
    const query = "SELECT * FROM staff WHERE firstName = ?, lastName = ?"
    const values = [firstName, lastName]
    db.all(query, values, function(errors, staffMembers){
        callback(errors, staffMembers)
    })
}
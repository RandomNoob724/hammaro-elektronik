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

exports.getAllStaff = function (callback) {
    const query = "SELECT * FROM staff"
    db.all(query, function(error, staff){
        callback(error, staff)
    })
}
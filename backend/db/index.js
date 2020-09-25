const mysql = require('mysql');
const {user,host,password,database,port} = require('../configure.js') //this is databse connection details
const connection = mysql.createConnection({
    host:host,
    user: user,
    password:password,
    database:database,
    port: port
}); //database connection using details, new object with methods
connection.connect(function(err) {
    if (err) {
    console.error('error connecting: ' + err.stack);
    return;
}
else{
    console.log("database has been connected");
}
});
process.env['TOKEN_KEY'] = 'tokenKey' //token key
module.exports = connection; //export onject and methods relating to the connected database
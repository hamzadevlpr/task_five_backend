const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'us-cluster-east-01.k8s.cleardb.net',
    user: 'b4fa20afc37650',
    password: '1be673c6',
    database: 'heroku_1379925013963b8'

});

module.exports = con;
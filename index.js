var https = require("https");
const axios = require("axios");
var path = require('path');
const fs = require('fs');
var sql = require('mssql');
require('dotenv').config()

// variable to store customer domains
var domains;

// config for database
var config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DB
};

// connect to the database
sql.connect(config, function (err){
  // if err throw it
  if (err) console.log(err);
  //create request object
  var request = new sql.Request();

  // query the database
  request.query('select domainname from customer where processactive = 1', function (err, recordset){
    // if err throw it
    if (err) console.log(err)
    // if no error send the records
    domains = recordset.recordset;
    console.log(domains);
  })

  request.close();
})



console.log("Script has finished Running");

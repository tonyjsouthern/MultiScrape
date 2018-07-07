var https = require("https");
const axios = require("axios");
var path = require('path');
const fs = require('fs');
var ISOLATION_LEVEL = require('tedious').ISOLATION_LEVEL;
var Connection = require('tedious').Connection;
var sql = require('sequelize');
var queries = require('./sql.js')
require('dotenv').config()

// variable to store customer domains
var domains = [];

// config for database
var config = {
  host: process.env.DB_SERVER,
  port: "1433",
  dialect: "mssql",
  userName: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB
};

// connect to the database
var connection = new sql(config.database, config.userName, config.password, config);

// intitialization function
function init() {
  new Promise(function(resolve, reject) {
    var dataSetOne = queryDbs(queries.one)
    var dataSetTwo = queryDbs(queries.two)
    resolve(dataSetOne, dataSetTwo);
  }).then(function() {
    console.log(domains)
 })
}

// calls the init function
init()

// querys the DB and pushes the results to the global domains varbale
function queryDbs(query) {
  return connection.query(query).spread(function(results) {
        for (var i = 0; i < results.length; i++) {
          domains.push(results[i].domainname)
    }
    connection.close();
  })
}

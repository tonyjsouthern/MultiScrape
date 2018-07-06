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
var domains =[];

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
var connection = new sql(config.database,config.userName,config.password,config);

// intitialization function
async function init () {
  await queryDbs(queries.one)
  await queryDbs(queries.two)
}

// calls the init function
init()

// querys the DB and pushes the results to the global domains varbale
function queryDbs (query) {
  connection.query(query).spread(function (results){
      for (var i = 0; i < results.length; i++) {
        domains.push(results.domainname)
      }
      console.log(domains.length)
      connection.close();
  }).catch(function (err) {
    console.log(err);
  })
}


/*
select * from customer where processactive = 1
select * from customerdomains

select c.DomainName, cd.DomainName from customer c
full outer join customerdomains cd on c.Customer_id = cd.Customer_id
where c.processactive = 1 and
*/

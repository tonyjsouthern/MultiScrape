var https = require("https");
const axios = require("axios");
var path = require('path');
const fs = require('fs');
var ISOLATION_LEVEL = require('tedious').ISOLATION_LEVEL;
var Connection = require('tedious').Connection;
var sql = require('sequelize');
require('dotenv').config()

// variable to store customer domains
var domains;

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

// query the database
connection.query(`SELECT domainname FROM customer WHERE processactive = 1 `).then(function (domain){
    domains = domain;
    console.log(domain);
    connection.close();
}).catch(function (err) {
    console.log(err);
})


/*
select * from customer where processactive = 1
select * from customerdomains

select c.DomainName, cd.DomainName from customer c
full outer join customerdomains cd on c.Customer_id = cd.Customer_id
where c.processactive = 1 and
*/

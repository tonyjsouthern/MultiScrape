var https = require("https");
const axios = require("axios");
var path = require("path");
const fs = require("fs");
var ISOLATION_LEVEL = require("tedious").ISOLATION_LEVEL;
var Connection = require("tedious").Connection;
var sql = require("sequelize");
var queries = require("./sql.js");
require("dotenv").config();

// GLOBAL VARIABLES
// variable to store customer domains
var domains = [];
// varable used to store the html after axios call
var storedHTML;
// varable that stores the current site the iteration is on
var currentSite;
// counter for recursive function
var i = 0;


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

// querys the DB and pushes the results to the global domains varbale
function queryDbs(query) {
  return connection.query(query).spread(function(results) {
    for (var i = 0; i < results.length; i++) {
      domains.push(results[i].domainname)
    }
    connection.close();
  })
}

// intitialization function
function init() {
  new Promise(function(resolve, reject) {
    // Runs the first SQL query to gather domains
    var dataSetOne = queryDbs(queries.one)
    // Runs the second SQL query to gather domains
    var dataSetTwo = queryDbs(queries.two)
    resolve(dataSetOne, dataSetTwo);
  }).then(function() {
    console.log("\n" + "Number of domains to scan: " + domains.length + "\n")
    // intitializes the recursive loop function
    loopSites()
  })
}

function loopSites() {
  new Promise(function(resolve, reject) {
    // set the global variable to the current website being checked
    currentSite = "http://" + domains[i];
    // log the current site and number in the domains array
    console.log(i + " of " + domains.length + " : " + currentSite);
    // run loadsite function
    var temp = loadSite(currentSite);
    resolve(temp);
  }).then(function() {
    // add a new function that contains all checks and takes a data parameter
    runChecks(storedHTML, currentSite)
    if (i == domains.length) {
      console.log("Process Completed.");
    } else {
      i++
      loopSites();
    }
  }).catch((err) => {
    console.log(err);
    i++
    loopSites();
  })
}

function runChecks(data, site) {
  checkSF(data, site);
  checkHubspot(data, site);
  checkMarketo(data, site);
  checkActon(data, site);
  checkClickDimensions(data, site);
  checkPardot(data, site);
}

function loadSite() {
  return axios.get(currentSite)
    .then(response => {
      storedHTML = response.data;
    })
    .catch(error => {
      fs.appendFile("sites/Error-Log.txt", currentSite + " : Error Code - " + error.code + "\n", (err) => {
        console.log("An error has occurred loading this website. Check the error.txt file for more information.");
      });
    });
}

// Intitializes Program
init()

// Tracking Script Checks

function checkSF(data, site) {
  if (data.indexOf("sf_config") != -1 || data.indexOf("frt(") != -1) {
    fs.appendFile("sites/SF.txt", site + "\n", (err) => {
      if (err) throw err;
      console.log("Saved - SF");
    });
  }
}

function checkHubspot(data, site) {
  if (data.indexOf("hs-scripts.com") != -1) {
    fs.appendFile("sites/hubspot.txt", site + "\n", (err) => {
      if (err) throw err;
      console.log("Saved - Hubspot");
    });
  }
}

function checkMarketo(data, site) {
  if (data.indexOf("munchkin") != -1) {
    fs.appendFile("sites/Marketo.txt", site + "\n", (err) => {
      if (err) throw err;
      console.log("Saved - Marketo");
    });
  }
}

function checkActon(data, site) {
  if (data.indexOf("acton") != -1) {
    fs.appendFile("sites/Act-On.txt", site + "\n", (err) => {
      if (err) throw err;
      console.log("Saved - Act-On");
    });
  }
}

function checkClickDimensions(data, site) {
  if (data.indexOf("clickdimensions") != -1) {
    fs.appendFile("sites/Click-Dimensions.txt", site + "\n", (err) => {
      if (err) throw err;
      console.log("Saved - Click Dimensions");
    });
  }
}

function checkPardot(data, site) {
  if (data.indexOf("pardot") != -1) {
    fs.appendFile("sites/Pardot.txt", site + "\n", (err) => {
      if (err) throw err;
      console.log("Saved - Pardot");
    });
  }
}

var https = require("https");
const fs = require("fs");
const axios = require("axios");
var path = require("path");
var sql = require("sequelize");
var Connection = require("tedious").Connection;
var queries = require("./lib/sql.js");
var scriptChecks = require("./lib/script-checks.js")
require("dotenv").config();

// import for manual domain siteList
var siteList = require("./manualsites.js")

// GLOBAL VARIABLES

// ----------- Uncomment this section to pull from db -----------
// variable to store customer domains
//var domains = [];
// --------------------------------------------------------------

// ----------- comment out this section to enable DB ------------
// variable to store a manual list of records
var domains = siteList;
console.log(siteList)
// test to see if sitelist is the correct length
console.log("The length of the manual list is: " + domains.length)
// ---------------------------------------------------------------


// varable used to store the html after axios call
var storedHTML;
// variable used to store the load storedStatus
var storedStatus;
// varable that stores the current site the iteration is on
var currentSite;
// counter for recursive function
var i = 0;

/*
// ----------- Uncomment this section to pull from db -----------

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


// intitialization function for DB pull
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
*/
// --------------------------------------------------------------


// init function for manual list
function init () {
  console.log("\n" + "Number of domains to scan: " + domains.length + "\n")
  loopSites()
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
    // after website has been loaded run all of the script checks
    runChecks(storedHTML, currentSite)
    // check to see if the loop is at the end of the array
    if (i === domains.length) {
      // if it is console log success messsage
      console.log("Process Completed.");
    } else {
      // if it isnt, increment I and run the function again
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
  scriptChecks.checkSF(data, site);
  scriptChecks.checkHubspot(data, site);
  scriptChecks.checkMarketo(data, site);
  scriptChecks.checkActon(data, site);
  scriptChecks.checkClickDimensions(data, site);
  scriptChecks.checkPardot(data, site);
}

// Function to load the website and store the HTML in a global variable
function loadSite() {
  // load the website
  return axios.get(currentSite)
    .then(response => {
      // When site is finished loading set the HTML to global variable
      storedHTML = response.data;
    })
    .catch(error => {
      // if error set HTML to blank so that it does not scan the previous site
      storedHTML = "";
      // If there is an error message write the website url and error code to logs
      fs.appendFileSync("sites/Error-Log.txt", currentSite + " : Error Code - " + error.code + "\n", (err) => {});
      console.log("An error has occurred loading " + currentSite + ". Check the error.txt file for more information.");
    });
}

// Intitializes Program
init();

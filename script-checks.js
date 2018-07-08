// Import FS
const fs = require("fs");

/*
SCRIPT CHECK BREAKDOWN:

// Declare function that takes HTML and a website URL
function(data, site) {
  // Check the HTML for a given peice of text
  if (data.indexOf("hs-scripts.com") != -1) {
    // If given text is present write the data to a text file in the sites folder
    fs.appendFile("sites/hubspot.txt", site + "\n", (err) => {
      // catch error
      if (err) throw err;
        // console log success message
        console.log("Saved - Hubspot");
    });
  }
}
*/

var scriptChecks = {

  checkSF: function(data, site) {
    if (data.indexOf("sf_config") != -1 || data.indexOf("frt(") != -1) {
      fs.appendFile("sites/SF.txt", site + "\n", (err) => {
        if (err) throw err;
        console.log("Saved - SF");
      });
    }
  },

  checkHubspot: function(data, site) {
    if (data.indexOf("hs-scripts.com") != -1) {
      fs.appendFile("sites/hubspot.txt", site + "\n", (err) => {
        if (err) throw err;
        console.log("Saved - Hubspot");
      });
    }
  },

  checkMarketo: function(data, site) {
    if (data.indexOf("munchkin") != -1) {
      fs.appendFile("sites/Marketo.txt", site + "\n", (err) => {
        if (err) throw err;
        console.log("Saved - Marketo");
      });
    }
  },

  checkActon: function(data, site) {
    if (data.indexOf("acton") != -1) {
      fs.appendFile("sites/Act-On.txt", site + "\n", (err) => {
        if (err) throw err;
        console.log("Saved - Act-On");
      });
    }
  },

  checkClickDimensions: function(data, site) {
    if (data.indexOf("clickdimensions") != -1) {
      fs.appendFile("sites/Click-Dimensions.txt", site + "\n", (err) => {
        if (err) throw err;
        console.log("Saved - Click Dimensions");
      });
    }
  },

  checkPardot: function(data, site) {
    if (data.indexOf("pardot") != -1) {
      fs.appendFile("sites/Pardot.txt", site + "\n", (err) => {
        if (err) throw err;
        console.log("Saved - Pardot");
      });
    }
  }

}

module.exports = scriptChecks;

# MultiScrape

This application runs a query against a database and grabs URL's. It then loads the URL's and checks for tracking marketing automation tracking scripts present on the website.

## Installation:

1) You must have Node.JS installed on your computer. To download Node.Js you can visit the offiicial site here: [www.nodejs.org](https://nodejs.org/en/download/ )
2) Clone the repository and run `npm install`
3) `npm start` to start the application

### Running the application on windows:
1) You must have Node.JS installed on your computer. To download Node.Js you can visit the offiicial site here: [www.nodejs.org](https://nodejs.org/en/download/ )
2) Download the zip above and unzip to a folder
3) Click the install bat file and wait for the command prompt to exit
4) Click "Run" bat file and the program will execute

## Configuration

#### SQL Server:
You can modify the SQL server by changing the default values in the config variable. By default they will be set to:
```
var config = {
  host: process.env.DB_SERVER,
  port: "1433",
  dialect: "mssql",
  userName: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB
};
```

#### SQL Commands:
In the root folder there is sql.js file that contains an object with designated SQL queries. To modify the query simply edit this file and interchange the object keys
```
module.exports = {
    one: "SELECT DISTINCT domainname FROM customer WHERE  processactive = 1 ",
    two: "SELECT Substring(domainname, 8, 60) AS domainname FROM   customerdomains WHERE  customer_id IN (SELECT customer_id FROM customer WHERE  processactive = 1) AND Substring(domainname, 8, 60) NOT IN (SELECT DISTINCT domainname FROM   customer)"
}
```

### Check Configuration
Example:

```
function checkPardot(data, site) {
  if (data.indexOf("pardot") != -1) {
    fs.appendFile("sites/Pardot.txt", site + "\n", (err) => {
      if (err) throw err;
      console.log("Saved - Pardot");
    });
  }
}
```

To change the criteria that is return simply change the text in the indexOf function, the name of the file that is being written to by `fs.appendFile` and the `console.log` text.




## Output
In the root folder of the application there is a folder titled "sites". Each check will create a corresponding text file in that folder and insert the names of the positive results into the file.

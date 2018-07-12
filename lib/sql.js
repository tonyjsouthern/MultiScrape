module.exports = {
    one: "SELECT DISTINCT domainname FROM customer WHERE  processactive = 1 ",
    two: "SELECT Substring(domainname, 8, 60) AS domainname FROM   customerdomains WHERE  customer_id IN (SELECT customer_id FROM customer WHERE  processactive = 1) AND Substring(domainname, 8, 60) NOT IN (SELECT DISTINCT domainname FROM   customer)"
}

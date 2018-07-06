module.exports = {
    one: "select distinct domainname from customer where processactive = 1",
    two: "select SUBSTRING(domainname, 8, 60) as domainname from customerdomains where customer_id in (select customer_id from customer where processactive = 1)   and SUBSTRING(domainname, 8, 60)  not in (select distinct domainname from customer) "
}

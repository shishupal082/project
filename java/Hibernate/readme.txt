ORM: Object Rational Mapping
Class --> Table
Object --> Row

Hibernate is a ORM tools.
Other ORM tools:
(1) Toplinc (Oracle)
(2) iBatis
Session s = SessionFactory(Configuration)
Configuration can be:
(1) XML
(2) JavaConfiguration
- DriverName
- Url and Databse
- UserName
- Password

s.save();
s.get();

JDBC implemented using 7 steps

Hibernet required dependencies
(1)
(2) Mysql connector

Configuration --> SessionFactory --> Session

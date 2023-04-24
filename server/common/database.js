import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "David1234",
  database: "vacations",
 });

export default connection;



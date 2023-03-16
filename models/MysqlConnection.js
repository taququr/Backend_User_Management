const mysql = require("mysql2/promise");

const connection = async () =>
  await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "backend_user_management",
  });

exports.connection = connection;

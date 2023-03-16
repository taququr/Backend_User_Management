const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/HttpError");
// const { connection } = require("../models/MysqlConnection");
const mysql = require("mysql2/promise");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Taqie Fadlillah",
    email: "test@test.com",
    password: "testtest",
  },
];

const getUsers = async (req, res, next) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "backend_user_management",
  });

  if (!connection) {
    return next(new HttpError(err), 422);
  }

  const [rows, fields] = await connection.query("select * from users");

  if (!rows) {
    res.status(404);
    res.send({ message: "There's no user in database" });
  }

  res.status(200);
  res.send({ data: rows });
  connection.destroy();
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data"), 422);
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "backend_user_management",
  });

  if (!connection) {
    return next(new HttpError(err), 422);
  }

  const { name, email, password } = req.body;
  const [emailFound] = await connection.execute(
    "select * from users where email = ?",
    [email]
  );

  if (emailFound.length > 0) {
    return next(
      new HttpError("Could not create user, email already exists"),
      422
    );
  }

  const [rows] = await connection.execute(
    "INSERT INTO users(name, email, password) values(?, ?, ?)",
    [name, email, password]
  );

  if (rows.length === 0) {
    return next(new HttpError(err, 422));
  }

  res.status(201);
  res.send({ message: "Successfully created", data: rows });
  connection.destroy();
};

const updateUser = async (req, res, next) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "backend_user_management",
  });

  const { email, password, newName, newEmail, newPassword } = req.body;

  if (!newName && !newEmail && !newPassword) {
    return next(new HttpError("Please insert valid data"), 500);
  }

  const [emailFound] = await connection.execute(
    "select * from users where email = ?",
    [email]
  );

  if (emailFound.length <= 0) {
    return next(new HttpError("User not found"), 422);
  } else if (emailFound[0].password !== password) {
    return next(new HttpError("Credential seems to be wrong"), 500);
  }

  const [updatedUser] = await connection.execute(
    "update users set name = ?, email = ?, password = ? where email = ?",
    [
      newName ? newName : emailFound[0].name,
      newEmail ? newEmail : emailFound[0].email,
      newPassword ? newPassword : emailFound[0].password,
      email,
    ]
  );

  if (updatedUser.length <= 0) {
    return next(new HttpError("There's seems to be something wrong"), 500);
  }

  res.json({ message: "Successfully updated", data: updatedUser });
  connection.destroy();
};

const deleteUser = async (req, res, next) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "backend_user_management",
  });

  const { email, password } = req.body;

  const [emailFound] = await connection.execute(
    "select * from users where email = ?",
    [email]
  );

  if (emailFound.length <= 0) {
    return next(new HttpError("User not found"), 422);
  } else if (emailFound[0].password !== password) {
    return next(new HttpError("Credential seems to be wrong"), 500);
  }

  const [userDeleted] = await connection.execute(
    "delete from users where email = ?",
    [email]
  );

  res.json({ message: "User deleted", data: userDeleted });
  connection.destroy();
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "backend_user_management",
  });

  const [emailFound] = await connection.execute(
    "select * from users where email = ?",
    [email]
  );

  if (emailFound.length === 0 || emailFound[0].password !== password) {
    return next(new HttpError("Credential seems to be wrong"), 404);
  }

  res.send({ message: "Logged in" });
  connection.destroy();
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.login = login;

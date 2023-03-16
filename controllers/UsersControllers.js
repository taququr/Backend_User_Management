const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/HttpError");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Taqie Fadlillah",
    email: "test@test.com",
    password: "testtest",
  },
];

const getUsers = (req, res, next) => {
  res.status(200);
  res.json({ user: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data"), 422);
  }

  const { name, email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (identifiedUser) {
    return next(
      new HttpError("Could not create user, email already exists", 422)
    );
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201);
  res.json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credential seems to be wrong",
        401
      )
    );
  }

  res.json({ message: "Logged in" });
};

const deleteUser = (req, res, next) => {
  const { email, password } = req.body;
  const { userId } = req.params;

  const identifiedUserEmail = DUMMY_USERS.find((user) => user.email === email);
  const identifiedUserId = DUMMY_USERS.find((user) => user.id === userId);
  if (!identifiedUserId) {
    return next(new HttpError("Could not find user with that id"), 404);
  } else if (
    !identifiedUserEmail ||
    identifiedUserEmail.password !== password
  ) {
    return next(
      new HttpError(
        "Could not identify user, credential seems to be wrong",
        401
      )
    );
  }

  DUMMY_USERS = DUMMY_USERS.filter((user) => user.id === userId);

  res.json({ message: "User deleted" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.deleteUser = deleteUser;

const express = require("express");
const { check } = require("express-validator");

const UsersControllers = require("../controllers/UsersControllers");

const router = express.Router();

router.get("/", UsersControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  UsersControllers.signup
);

router.post("/login", UsersControllers.login);

router.delete(
  "/delete/:userId",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  UsersControllers.deleteUser
);

module.exports = router;

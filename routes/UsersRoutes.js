const express = require("express");
const { check } = require("express-validator");

const UsersControllers = require("../controllers/UsersControllers");

const router = express.Router();

router.get("/", UsersControllers.getUsers);

router.post(
  "/create",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  UsersControllers.createUser
);

router.post("/login", UsersControllers.login);

router.delete(
  "/delete",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  UsersControllers.deleteUser
);

router.put(
  "/update",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  UsersControllers.updateUser
);

module.exports = router;

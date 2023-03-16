const express = require("express");
const { check } = require("express-validator");

const UsersControllers = require("../controllers/UsersControllers");

const router = express.Router();

router.get("/", UsersControllers.getUsers);

router.post("/login", UsersControllers.login);

router.post(
  "/create",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("rolesId").notEmpty(),
    check("creatorRoles").notEmpty(),
  ],
  UsersControllers.createUser
);

router.put(
  "/update",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("updaterRoles").notEmpty(),
  ],
  UsersControllers.updateUser
);

router.delete(
  "/delete",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("deleterRoles").notEmpty(),
  ],
  UsersControllers.deleteUser
);

module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");

const UsersRoutes = require("./routes/UsersRoutes");
const HttpError = require("./models/HttpError");

const app = express();

app.use(bodyParser.json()); // for handling request from client (req.body)

app.use("/users", UsersRoutes); // for handling users route

app.use((req, res, next) => {
  // for handling unsupported route
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  // for handling unknown error
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

app.listen(5000, () => {
  console.log("listening to port 5000");
});

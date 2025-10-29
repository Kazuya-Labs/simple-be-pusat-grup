require("dotenv").config();
const express = require("express");
const routes = require("./src/routes.js");
const app = express();
const PORT = process.env.PORT || 3001;
const connectDB = require("./src/database");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectDB();

app.use((req, res, next) => {
  try {
    console.log(`[ ${req.method} ] ${req.url}`);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.use("/api/v1", routes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Backend start in port ${PORT}`);
});

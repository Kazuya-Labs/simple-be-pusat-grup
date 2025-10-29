const express = require("express");
const router = express.Router();
const searchController = require("./controller/searchController");
const addGroupController = require("./controller/addGrupController");
//const teratas = require("./controller/teratas");
router.get("/search", searchController);
router.post("/add", addGroupController);


module.exports = router;

const express = require("express");
const router = express.Router();
const { getLocations } = require("../controllers/mapController.js");

router.get("/", getLocations);

module.exports = router;

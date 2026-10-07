const express = require("express");
const { handleCreateShortUrl, handleRedirection, handleGetVisitAnalytics } = require("../controllers/url");

const router = express.Router();

router.post("/", handleCreateShortUrl);
router.get("/:shortID", handleRedirection)
router.get("/visit-analytics/:shortID", handleGetVisitAnalytics)
module.exports = router;
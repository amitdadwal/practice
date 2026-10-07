const express = require("express");
const {handleStaticRoutes, handleSignUpRoute, handleloginRoute} = require("../controllers/static");

const router = express.Router();
router.get("/", handleStaticRoutes);
router.get("/login", handleloginRoute);
router.get("/signup", handleSignUpRoute);

module.exports= router;
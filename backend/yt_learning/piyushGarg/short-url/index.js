const express = require("express");
const {connectToDB} = require("./connection.js");
const cookieParser = require("cookie-parser");
//router 
const authRouter = require("./routes/auth.js");
const urlRouter = require("./routes/url.js");
const staticRouter = require("./routes/static.js");


const path = require("path");
const { restrictToLoggedInUserOnly, createAuth } = require("./middlewares/index.js");

const PORT = 8001;

const app = express();
connectToDB("mongodb://127.0.0.1:27017/short-url").then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log("Error Connecting DB: ", err)
})

//ejs setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/url",  restrictToLoggedInUserOnly, urlRouter);
app.use("/", createAuth, staticRouter);

// server litening
app.listen(PORT, ()=>{
    `Server is running on PORT: ${PORT}`;
})
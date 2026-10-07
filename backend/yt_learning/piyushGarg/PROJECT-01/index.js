const express = require("express");
const {connectToMongoDb} = require("./connection.js");
const { userRouter } = require("./routes/user.js");
const { logReqRes } = require("./middlewares/index.js");

connectToMongoDb("mongodb://127.0.0.1:27017/youtube_app_1").then(()=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log("Error in connecting DB :"+ err)
});
const app = express();
const PORT = 8000;

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(logReqRes("log.txt"))

// ROUTES
app.use("/api/users", userRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT:${PORT}`);
})

const express = require("express");
const app = express();
const PORT = 8000
app.get("/", (req, res) => {
    res.send("Hello from express");
})

app.get("/about", (req, res) => {
    res.send(`Hello ${req.query.name}`);
})

app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
})
// const http = require("http");
// const fs = require("fs");
// const url = require("url");

// const server = http.createServer((req, res) => {
//     if (req.url === "/favicon.ico") return res.end();

//     const log = `${Date.now()} : ${req.url} New Request Recieved\n`;
//     const myUrl = url.parse(req.url, true);
//     console.log(myUrl);
//     fs.appendFile("log.txt", log, () => {
//         switch (myUrl.pathname) {
//             case "/": res.end("Home Page");
//                 break;
//             case "/about":
//                 const userName = myUrl.query.name
//                 res.end(`Hi i ${userName}`);
//                 break;
//             default: res.end("404 Not Found");
//         }
//     })

// });

// server.listen(PORT, () => {
//     console.log(`server started at port ${PORT}`);
// })


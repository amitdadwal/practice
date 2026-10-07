const fs = require("fs");

function logReqRes (fileName){
    return (req, res, next)=>{
          fs.appendFile(fileName, `${Date.now()}: ${req.method} : ${req.path} \n`, (err)=>{
        console.log(err);
    });
    next();
    }
}

module.exports ={
    logReqRes
}
const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next){
    const uid = req.cookies.uid;
    if(!uid){
        return res.status(401).redirect("/login")
    }
    const user = getUser(uid);

    if(!user){
        return res.status(401).redirect("login")
    }
    req.user = user
    next();
}

async function createAuth (req, res, next){
    const uid = req.cookies.uid;
    const user = getUser(uid);
    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
    createAuth
}
const Url = require("../models/url")

async function handleStaticRoutes(req, res){
    if(!req.user) return res.redirect("/login")
    const urls = await Url.find({createdBy: req.user._id});
    console.log( "urls", urls, )

    return res.render("home", {
        urls: urls
    })
}

async function handleSignUpRoute(req, res){
    res.render("signup")
}
async function handleloginRoute(req, res){
    res.render("login")
}

module.exports = {handleStaticRoutes, handleSignUpRoute, handleloginRoute};
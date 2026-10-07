const USERS = require("../models/user");
const { setUser } = require("../service/auth");
async function handleSignup (req, res){
    const body = req.body;
    if(!body.name || !body.email || !body.password){
        res.status(400).render("signup", {
            error: "All fields are required"
        })
    }
    const user = await USERS.create({
        name: body.name,
        email: body.email,
        password: body.password
    })
    res.redirect("/");
}

async function handleLogin (req, res){
    const body = req.body;
    if(!body?.email || !body?.password){
       return res.status(400).render("login", {
            error: "All fields are required"
        })
    }
    const email = body.email;
    const password = body.password;

    const user = await USERS.findOne({email, password});
    if(!user){
     return res.status(401).render("login", {
            error: "Invalid User"
        }) 
    }
    const uuid = crypto.randomUUID();
    setUser(uuid, user);
    res.cookie("uid", uuid);
    return res.redirect("/");
}

module.exports={
    handleSignup,
    handleLogin
}
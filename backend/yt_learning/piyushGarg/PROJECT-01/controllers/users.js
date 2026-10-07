const User = require("../models/user");

async function handleGetAllUsers(req, res){
 const allDbUsers = await User.find();
    return res.status(200).json({
        msg :"Users list retrieved successfully",
        users: allDbUsers
    });
}
async function handleGetUserById(req, res){
 const id = req.params.id;
    const dbUser = await User.findById(id);
    return res.status(200).json({
        msg:"Success",
        data: dbUser
    });
}

async function handleUpdateUser(req, res){
     const id = req.params.id;
     const dbUser = await User.findByIdAndUpdate(id, {
        lastName: req.body.lastName
     })
     return res.status(200).json({
        msg:"User updated Successfully",
        data: dbUser
     })
}

async function handleDeleteUser(req, res){
     const id = req.params.id;
    const deletedUsers = await User.findByIdAndDelete(id);
    res.status(200).json({
        msg:"User deleted successfully"
    })
}

async function handleCreateUser (req, res){
        const body = req.body;
        if(!body.firstName || !body.lastName || !body.gender || !body.email || !body.jobTitle){
           return res.status(400).json({
                msg:"All fields are required"
            })
        }
        const result = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            gender: body.gender,
            jobTitle: body.jobTitle
        })
    
        return res.status(201).json({
            msg: "User created successfully",
            data: result
        })
}
module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUser,
    handleDeleteUser,
    handleCreateUser
}
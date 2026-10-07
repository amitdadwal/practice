const express = require("express");
const { handleGetAllUsers, handleGetUserById, handleUpdateUser, handleDeleteUser, handleCreateUser } = require("../controllers/users");
const userRouter = express.Router();

userRouter.route("/").get(handleGetAllUsers).post(handleCreateUser);
userRouter.route("/:id")
.get(handleGetUserById)
.patch(handleUpdateUser)
.delete(handleDeleteUser)

module.exports = {
    userRouter
}
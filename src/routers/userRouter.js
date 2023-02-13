import express from "express";

const userRouter = express.Router();

const handleEdituser = (req, res) => res.send("Edit User");
const handleDeleteuser = (req, res) => res.send("Delete User");

userRouter.get("/edit", handleEdituser);
userRouter.get("/delete", handleDeleteuser);

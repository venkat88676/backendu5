const express=require("express")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")

const {UserModel}=require('../models/userModel')
const {BlacklistModel}=require("../models/blacklistModel")
const userRouter=express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
      const { email, password, role } = req.body;
        console.log(email,password,role)
      // Check if user already exists
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      // Create a new user
      const hashed_password = bcrypt.hashSync(password, 8);
      const user = new UserModel({ email, password: hashed_password, role });
      await user.save();  
      res.send({ message: "User created successfully" });
    } catch (error) {
      res.send(error.message);
    }
});


userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by username
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User is not register" });
    }
    // Compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Create a token
    const token = jwt.sign({ email:email,role:user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    //refresh token
    const refreshtoken = jwt.sign({email:email,role:user.role},process.env.REFRESH_SECRET,{
        expiresIn: "3m",
      }
    );
    res.json({ msg: "login successfull", token, refreshtoken });
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/logout", async (req, res) => {
    try {
      // Add token to blacklist collection
      const token = req.headers.authorization.split(" ")[1];
      const blacklistedToken = new BlacklistModel({ token });
      await blacklistedToken.save();
  
      res.status(200).send("Logged out successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

module.exports={userRouter}

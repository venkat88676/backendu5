const jwt = require('jsonwebtoken');
require("dotenv").config()
const {UserModel} = require("../models/userModel")
const {BlacklistModel} = require("../models/blacklistModel")

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    // checking for blacklisted token
    const blacklisted=await BlacklistModel.findOne({token});
    if(blacklisted){
      return res.status(401).send("Token is Blacklisted..")
    }
   // Check if the user exists
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decodedToken;
    const user = await UserModel.findOne({email});
    if (!user) {
      return res.status(401).json({ message: 'Please Register' });
    }
    req.body.email=email
    // Attach the role to req object
    const role=user?.role
    req.role=role

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Unauthorized', err : error.message});
  }
};

module.exports = {authenticate};

const User = require('../model/user.js');
const bcrypt =  require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
   try{

      //constant validation for email
      const errors = validationResult(req);  

      if(!errors.isEmpty()){
         return res.status(400).json({
            message : "Validation error occured",
            errors : errors.array()
         });
      }

      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({email : email});

      if(!user){
         return res.status(404).json({
            message : "User for this email address not found"
         });
      }

      const doesMatch = await bcrypt.compare(password, user.password);

      if(!doesMatch){
         return res.status(401).json({
            message : "Password does not match the user with the email"
         });
      }

      const token = jwt.sign({
         email : email,
         id : user._id.toString()
      }, process.env.jwt_secret_key);

      return res.status(200).json({
         message : "User logged in",
         token : token,
         name : user.name,
         profilePictureUrl : user.profile_picture
      });

   } catch (err) {
      return res.status(500).json({
         message : "Internal server occured",
         error : err.message
      });
   }
}

const signUp = async (req, res) => {

   try{


      const errors = validationResult(req);

      if(!errors.isEmpty()){

         return res.status(400).json({
            message : "Validation request occured",
            errors : errors.array()
         })
      }

      const userName = req.body.userName;
      const password = req.body.password;
      const email = req.body.email;
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
         username : userName,
         email : email,
         password : hashedPassword
      });

      console.log(newUser);

      const token = jwt.sign({
         email : email,
         id : newUser._id.toString()
      }, process.env.jwt_secret_key);

      return res.status(200).json({
         message : "User logged in",
         token : token,
         name : newUser.username,
      });

   } catch (err) {
      console.log(err.message);
      return res.status(500).json(err.message);
   }
}
module.exports = {
   loginUser,
   signUp
}
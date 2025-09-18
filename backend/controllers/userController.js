import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { user } from "../models/userModel.js";

export const register=async(req,res)=>{

    try{
      const {firstName , lastName, email , password}=req.body;
      if( !firstName || !lastName || !email || !password){
        return(
            res.status(400).json({
                success:false,
                message:"All fields are required"

            })
        )
      }
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid Email"
        })
      }
      if(password.length<6){
        return res.status(400).json({
            success:false,
            message:"Password must be more than 6 characters"
        })
      }
      const existingUser= await user.findOne({email:email});
      if(existingUser){
        return(
            res.status(400).json({
                success:false,
                message:"Email already registered"
            })
        )
      }
      const hashPassword = await bcrypt.hash(password,10)
      await user.create({
        firstName,
        lastName ,
        email ,
        password : hashPassword
      })
      return(
        res.status(201).json({
            success:true,
            message:"Account Created Succesfully"
        })
      )

    }
    catch (error){
        console.log(error)
        return(
            res.status(500).json({
                success:false,
                message:"Failed to register"
            })
        )

    }

}

export const login=async(req,res)=>{
  try{
    const {email ,password} =req.body
    if(!email || !password){
      return(
        res.status(400).json({
          success:false,
          message:"All fields are required"
        })
      )
    }
       let existingUser = await user.findOne({email});
       if(!existingUser){
        return(
          res.status(404).json({
            success:false,
            message:"Incorrect email or password"
          })
        )
      }

      let correctPassword = await bcrypt.compare(password ,existingUser.password)
      if(!correctPassword){
        return(
          res.status(400).json({
            success:false,
            message:"Incorrect credentials",
          })
        )
      }
      
      // console.log("User found:", existingUser);


      const token = await jwt.sign({userId:existingUser._id},process.env.SECRET_KEY , {expiresIn:"1d"})
      return(res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpOnly:true , sameSite:"strict"}).json({
        success:true,
        message:`Welcome Back ${existingUser.firstName}`,
        user: existingUser
      }))
    
  }
  catch(error){
    console.log(error)
    return(
      res.status(500).json({
        success:false,
        message:"Failed to login"
      })
    )
  }
}

export const logout=async(_,res)=>{
  try{
    return res.status(200).cookie("token" ,"",{maxAge:"0"}).json({
      success:true ,
      message:"Logout Sucessfully"
    })
  }
  catch(error){
    console.log(error)

  }
}

export const updateProfile = async(req, res) => {
    try {
        const userId= req.id
        const {firstName, lastName, occupation, bio, instagram, facebook, linkedin, github} = req.body;
        const file = req.file;

        const fileUri = getDataUri(file)
        let cloudResponse = await cloudinary.uploader.upload(fileUri.content)
       
        const existingUser = await user.findById(userId).select("-password")
        
        if(!existingUser){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }

        // updating data
        if(firstName) existingUser.firstName = firstName
        if(lastName) existingUser.lastName = lastName
        if(occupation) existingUser.occupation = occupation
        if(instagram) existingUser.instagram = instagram
        if(facebook) existingUser.facebook = facebook
        if(linkedin) existingUser.linkedin = linkedin
        if(github) existingUser.github = github
        if(bio) existingUser.bio = bio
        if(file) existingUser.photoUrl = cloudResponse.secure_url

        await existingUser.save()
        return res.status(200).json({
            message:"profile updated successfully",
            success:true,
            user:existingUser
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        })
    }
}

export const getAllUsers = async(req,res)=>{
   
     try {
          const users= await user.find().select("-password") //except password
          res.status(200).json({
            status:true,
            message:"User fetched Successfully",
            total:users.length,
            users
          })
      
     } catch (error) {
      console.log("Error fetching user list",error);
      return res.status(500).json({
        success:false,
        message:"Failed to get users"
      })
      
     }
}
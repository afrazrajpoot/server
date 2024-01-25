// const User = require('../models/userModel.js')
const User = require("../models/userModel")
const { uploadOnCloudinary } = require("../upload/cloudinary")
const { asyncHandler } = require("../utils/asyncHandler")
const CoustomError = require('../utils/coustomError')
const jwt = require("jsonwebtoken")
exports.createUser = asyncHandler(async(req,res,next)=>{
    console.log("hyg")
   const {username,password,email} = req.body
   const isEmail = await User.findOne({email:email})
   if(isEmail){
    return next(new CoustomError("email already exists",400))
   }
   const avatarLocalPath = req.files?.avatar[0]?.path;
//    console.log(avatarLocalPath + "av")
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
   }
   console.log(req.files)
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   const user = await User.create({username,email,password,avatar:avatar?.url,coverImage:coverImage?.url})
   res.status(201).json({
    success:true,
    data:user
   })
})
exports.getAllUser = asyncHandler(async(req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        success:true,
        data:users
    })
})
exports.updateData = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const user = await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
    res.status(200).json({
        success:true,
        data:user
    })
})
exports.deleteUser = asyncHandler(async(req, res, next)=>{
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)
    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})
exports.login = asyncHandler(async(req, res, next)=>{
    const {email,password} = req.body
    const user = await User.findOne({email:email})
    if(!user){
        return next(new CoustomError("user not found",400))
    }
    const isMatch = await user.matchPassword(password)
    if(!isMatch){
        return next(new CoustomError("password does not match",400))
    }
    const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"1d"})
    res.cookie("token",token,{httpOnly:true})
    res.status(200).json({
        success:true,
        message:"login successful",
        data:user
    })
})
exports.changePassword = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(id)
    if(!user){
        return next(new CoustomError("user not found",400))
    }
    const isMatch = await user.matchPassword(oldPassword)
    if(!isMatch){
        return next(new CoustomError("password does not match",400))
    }
    user.password = newPassword
    await user.save()
    res.status(200).json({
        success:true,
        message:"password changed successfully"
    })
})
exports.updateAvatar = asyncHandler(async (req,res,next)=>{
    const  avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        return next(new CoustomError("Avatar file must be need",400))
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        return next(new CoustomError("Avatar upload failed",400))
    }
    const user = await User.findByIdAndUpdate(req.user?.id, {$set:{avatar: avatar.url}},{new:true}).select('-password')
    return res.status(200).json({
        success:true,
        user,
        message:"Avatar updated successfully"
    })

})
exports.logout=asyncHandler(async(req, res, next)=>{
    res.clearCookie("token")
    res.status(200).json({
        success:true,
        message:"logout successful"
    })
})
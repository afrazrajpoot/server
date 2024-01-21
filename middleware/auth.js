const jwt = require("jsonwebtoken")
const { asyncHandler } = require("../utils/asyncHandler")
const CoustomError = require("../utils/coustomError")
// const asyncHandler = require("../utils/asyncHandler")
exports.verfyToken = asyncHandler(async (req,res,next)=>{
    const token = req.cookies.token
    if(!token){
        return next(new CoustomError("login to access this",400))
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    req.user = decoded.id
    next()
})
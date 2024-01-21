exports.errorMidle = (error,req,res,next)=>{
    error.message =error.message ||"internal server error";
    error.statusCode = error.statusCode || 500;
    res.status(error.statusCode).json({
        succes:false,
        message:error.message,

    })
}
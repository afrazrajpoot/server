const express = require('express');
const { m1 } = require('./middleware/m1');
const app = express();
const userRoutes = require('./routes/user.route');
const { errorMidle } = require('./middleware/errorMideleware');
const CoustomError = require('./utils/coustomError');
const cors = require('cors')
const cookieParser = require("cookie-parser")
app.use(cors({
    origin:'http://localhost:3000',
    optionsSuccessStatus:200,
    credentials:true,
    methods:['GET','POST','DELETE','PUT']
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/',userRoutes);
app.get('/',(req,res)=>{
    // const message = tested("Afraz")
    res.status(200).json({
        message:"Api tested"
    })
})
app.all("*",(req,res,next)=>{
   return  next(new CoustomError(`this url ${req.url} is not valid`,400))
})
app.use(errorMidle)
module.exports = app
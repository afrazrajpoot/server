const mongoose = require('mongoose');
const connection = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to database")
    }catch(err){
        console.log(err.name+"connection failed")
    }
}
module.exports = connection
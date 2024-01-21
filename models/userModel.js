const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = new mongoose.Schema(
  {
    username:{
        type: String,
        required: [true,"username required"]
    },
    password:{
        type: String,
        required: [true,"password required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
          validator: function (value) {
            // Use a regular expression to validate the email format
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: 'Invalid email format',
        },
      },
  },
  { timestamps: true }
);
userModel.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})
userModel.methods.matchPassword = function(password){
  return bcrypt.compare(password,this.password);
}

const User = mongoose.model("User", userModel);
module.exports = User;

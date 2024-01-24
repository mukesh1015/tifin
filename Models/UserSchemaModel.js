// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  parentId:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
  },
  address: {
    type: String,
  },
  photo: {
    type: String,
  },
  userName: {
    type: String, 
  },
  profile: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, 
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

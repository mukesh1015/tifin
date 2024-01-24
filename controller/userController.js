const UserSchemaModel = require('../Models/UserSchemaModel')
const {comparePassword, hashpassword} = require('../helper/authPassword');
const JWT = require('jsonwebtoken');
const path = require("path")
const fs = require("fs")
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check user
    const existingUser = await UserSchemaModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: true,
        massage: 'Already Register Please Login Another Email Id',
      });
    }

    // user
    const hashedPassword = await hashpassword(password);
    //save
    const user = await new UserSchemaModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: 'User Registered Successfully',
      Data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Registration',
      error,
    });
  }
};




exports.login= async(req,res)=>{
  try{
  const {email,password}= req.body
  //validate
  if(!email || !password){
      return res.status(404).send({
          success:false,
          message: 'Invalid email or Password', 
      })
  }
  //check user
  const user = await UserSchemaModel.findOne({email})
  if(!user){
      return res.status(404).send({
          success:false,
          message: 'Email is Not Register', 
      })
  }
  //password decrypt
  const match  = await comparePassword(password,user.password)
  if(!match){
      return res.status(208).send({
          success:false,
          message:"Invalid password"
      })
  }

  const data = {...user._doc}
  delete data.password
  //token
  const token = await JWT.sign(data,process.env.JWT_SECRET,{
      // expiresIn:'1d',
  })
  res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  
  console.log(user)
  return res.status(200).send({
      success:true,
      message:"Login Successfully",
      user:{
          name:user.name,
          email:user.email,
         
          role:user.role,

      },
      token,
  })
  }catch(error){
      console.log(error)
      res.status(500).send({
          success:false,
          message: 'Error In Login',
          error,
      })
  }
  };


 
 
  
  exports.createUser = async (req, res) => {
    try{
     
      const {name,address,phone,password,email,userName,profile} = req.body
      const photo = req.file ? `/uploads/${req.file.filename}` : '';
      const hashedPassword = await hashpassword(password);
      const Newuser = await new UserSchemaModel({name,address,phone,password:hashedPassword,email,userName,photo,profile,parentId:req.user._id},).save();
      res.status(201).send({
          success:true,
          message: 'User Created Successfully',
          Data:Newuser,
      })
          }
          catch(error){
              console.log(error)
              res.status(500).send({
                  success:false,
                  message: error.message,
                
              })
          }
  };
  
  exports.getcreateUser = async (req, res) => {
    try{
const newUser =await UserSchemaModel.find()
res.status(200).send({
    success:true,
    message: ' All createuser List',
     Data:newUser,
});
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Error In createuser List',
            error,
        })
    }

};

exports.deleteUser = async (req, res) => {
  try {
    
    const id = req.params.id;  
    const deletedUser = await UserSchemaModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: 'User not found or already deleted',
      });
    }

    res.status(200).send({
      success: true,
      message: 'User deleted successfully',
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in deleting user',
      error,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you receive the user ID in the URL parameters

    const { name, address, phone, email, userName, profile } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : '';

    const oldData = await UserSchemaModel.findById(userId);

if (req.file && oldData.photo) {
  const oldPath = path.join(__dirname, "..", oldData.photo);
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }
} else if (oldData.photo) {
  console.log('Path of the old photo:', oldData.photo);
} 


    // Assuming you have a UserSchemaModel that can find and update the user by ID
    const user = await UserSchemaModel.findByIdAndUpdate(
      userId,
      { 
        ...(name?{name}:{}),
        ...(address?{address}:{}),
        ...(phone?{phone}:{}),
        ...(email?{email}:{}),
        ...(userName?{userName}:{}),
        ...(photo?{photo}:{}),
        ...(profile?{profile}:{}),
        
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'User Updated Successfully',
      Data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

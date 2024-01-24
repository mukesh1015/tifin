 
const JWT= require ('jsonwebtoken')
const  UserSchemaModel = require ('../Models/UserSchemaModel')

 exports.requireSignIn = async(req,res,next)=>{ 
try{
   
    const myToken  =  req.headers.authorization
    let token =  myToken?.substring(7) || req.cookies.token

    if (!token) {
      return res.status(401).json({
        success:false,
        message: 'Invalid Token' 
    });
    }
  
    const decode = JWT.verify(token, process.env.JWT_SECRET)
    const user = UserSchemaModel.findById(decode._id)
    if(!user){
        return res.status(401).json({
            success:false,
            message: 'Unauthorized User' 
        }); 
    }

    req.user= decode;
    next(); 
}
catch(error){
    console.log(error)
    res.status(400).send({
        success:false,
        message:error.message
    })
}
}

exports.isAdmin= async(req,res,next)=>{
    try{
        const {_id} = req.user
    const user = await UserSchemaModel.findOne({_id:_id, role:0})
    if(!user){
        return res.status(401).json({
            success:false,
            message: 'Unauthorized User' 
        }); 
    }
    next()

    }catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            message:'Error in User Middleware',
            error,
        })
    }
}


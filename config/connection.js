

const mongoose=  require("mongoose")
const connectDB = async()=>{
    try{
        const mongo_url =process.env.MONGO_url
        console.log("url",mongo_url)
        const conn = await mongoose.connect(mongo_url);
        console.log(`connected To Database ${conn.connection.host}`);
    }catch(error){
        console.log(`Error in MongoDb ${error}`)
    }
};
module.exports = connectDB;


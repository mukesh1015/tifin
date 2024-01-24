const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./config/connection.js');
const UserRoutes = require('./routes/UserRoutes')

dotenv.config()
// database config

 connectDB();
const app= express();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/api/v1/user', UserRoutes)

const PORT = process.env.PORT ||5500;
app.listen(PORT,()=>{
    console.log(`server Running on ${process.env.DEV_MODE} mode on port ${PORT}`)
})
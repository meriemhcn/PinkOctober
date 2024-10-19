const express = require("express");
const cors=require("cors");
const cookieParser = require('cookie-parser');
const app=express();
const Erreurhandler = require("./middleware/errorhandler.js");
const dotenv=require("dotenv");
const ConnectDb=require("./dataBase/main.js");
const {genertatoken,verifytoken}=require("./util/jwt.js");

dotenv.config();


app.use(express.json());//middleware
/*const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }*/
  app.use(cors());
app.use(cookieParser());

app.use("/user",require("./routes/Route2.js"));
app.use(Erreurhandler);

app.get("/verify",function(req,res){
    const token=req.query.token;
    const data=verifytoken(token);
    if(!data)
    {
            res.json("your token is invalid");
    }
    res.json(data);
    
    });


async function start(){
    try{
    await ConnectDb(process.env.DATABASE_URL);
    app.listen(process.env.PORT,()=>{console.log('server is on the port ' +process.env.PORT );});}
    catch{
        console.log("une erreur est apparu");
    }
}

start();


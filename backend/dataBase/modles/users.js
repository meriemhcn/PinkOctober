const mongoose=require("mongoose");
const { isEmail } = require('validator');
const UserSchema= new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            trim: true
          },
          email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
          },
          firstName:{
            type:String,
            required:true,
            trim:true,
          },
          lastName:{
            type:String,
            required:true,
            trim:true,
          },
         password: {type : String,
        required:true,
         },
         picture: {
            type: String,
            default: "./uploads/profil/random-user.png"         // ReMinder a moi meme phot unique 
          },
          bio :{
            type: String,
            max: 1024,
          },
          followers: {
            type: [String]
          },
          following: {
            type: [String]
          },
          likes: {
            type: [String]
          }

    },
      {
        timestamps: true,
      }
);
const UserSchemaModle=mongoose.model(
    "user",UserSchema
);
module.exports=UserSchemaModle;
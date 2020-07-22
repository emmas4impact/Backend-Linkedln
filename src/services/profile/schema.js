const {Schema} = require ("mongoose")
const mongoose = require ("mongoose")
const v = require("validator")

const ProfileSchema =  new Schema({
   

    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    
    },
    surname:{
      type:String,
      required:true,
    },
    email:{
        type:String,
        required:true,
        validator: async(value)=>{
            if(!v.isEmail(value)){
                throw new Error("Email is invalid")
            }else{
                const checkEmail = await ProfilesModel.findOne({email:value})
                if(checkEmail){
                    throw new Error ("Email already exists")
                }
            }
        }
    },
    bio:{
        type:String,
        required:[true, 'please add a bio'],
        maxlength:[500, 'Bio cannot be more than 500 characters']
    },
    title:{
        type:String,
        required:true,
    },
    area:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
     type:Date,
     default: Date.now
    },
    updatedAt: {
        type:Date,
        default:Date.now
    },
    
       
})

const ProfilesModel = mongoose.model("Profile", ProfileSchema)
module.exports = ProfilesModel
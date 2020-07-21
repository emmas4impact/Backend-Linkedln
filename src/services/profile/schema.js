const {Schema} = require ("mongoose")
const mongoose = require ("mongoose")

const ProfileSchema =  new Schema({
    
    name:{
        type:String,
        required:true,
    },
    surname:{
      type:String,
      required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
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
        required:true,
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
        
    },
    
        
}, {timestamps:true})

const ProfilesModel = mongoose.model("Profile", ProfileSchema)
module.exports = ProfilesModel;
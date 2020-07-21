const {Schema} = require ("mongoose")
const mongoose = require ("mongoose")
const v = require("validator")

const ProfileSchema =  new Schema({
    _id:String,
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
    createdAt:{
        type:Date, default: Date.now
    },
    updatedAt: {
        type:Date, default:Date.now
    }
       
})

const ProfilesModel = mongoose.model("Profile", ProfileSchema)
module.exports = ProfilesModel
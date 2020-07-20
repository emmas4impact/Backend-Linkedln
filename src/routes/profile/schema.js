const {Schema} = require ("mongoose")
const mongoose = require ("mongoose")

const ProfileSchema =  new Schema({
    _id:String,
    name:String,
    surname:String,
    email:String,
    bio:String,
    title:String,
    area:String,
    image:String,
    username:String,
    createdAt: Date,
    updatedAt:Date
        
})

const ProfilesModel = mongoose.model("Profile", ProfileSchema)
module.exports = ProfilesModel
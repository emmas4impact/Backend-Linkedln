const {Schema} = require ("mongoose")
const mongoose = require ("mongoose")

const profileSchema =  new Schema({
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

const profileModel = mongoose.model("Profile", profileSchema)
module.exports = profileModel
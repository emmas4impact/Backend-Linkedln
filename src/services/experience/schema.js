const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ExperienceSchema = new Schema({
  
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    
    
  },
  image: {
      type: String,
     
  }
},{timestamps: true})

module.exports = mongoose.model("experience", ExperienceSchema)

const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const { text } = require("body-parser");

// const PostProfileSchema = new Schema({
//   _id: String,
//   name: String,
//   description: String,
//   brand: String,
//   price: Number,
//   imageUrl: String,
//   category: String,
//   createdAt:Date,
//   updatedAt: Date,
//   profiles: [{ _id: Schema.Types.ObjectId, comment: String, rate: Number, createdAt:Date }],
//   quantity: Number,
// })
const PostSchema = new Schema({
    text: {
      type: String,
      required: true,
    },  
//     username: {
//       type: String,
//       required: true,
//       unique: true
//   },
  
 
  user: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'profile',
       
    }],
  image:{
    type: String,
  }
    
  },{ timestamps: true })
  
  PostSchema.pre("save", function (next){
    
    this.updatedAt=Date.now();
    next();
  });
  PostSchema.static("postProfile", async function(postId){
    const post = await postModel.findOne({_id: postId}).populate("profile");
    return  post ;
});

PostSchema.post("validate", function (error, doc, next) {
    if (error) {
      error.httpStatusCode = 400;
      next(error);
    } else {
      next();
    }
  });
  
  PostSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
      error.httpStatusCode = 400;
      next(error);
    } else {
      next();
    }
  });
  

const postModel = mongoose.model("post",  PostSchema);
module.exports = postModel; 
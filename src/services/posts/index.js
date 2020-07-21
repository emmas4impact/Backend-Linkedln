const express = require("express")
const multer = require("multer")
// const PostSchema = require("./schema")
const postModel = require("./schema")
const path =require("path")
const fs =require("fs-extra")
const postRouter = express.Router()

const port = process.env.PORT
const imagePath = path.join(__dirname, "../../../public/images/post");
console.log(imagePath)
const upload = multer({});




postRouter.get("/", async (req, res, next) => {
  try {
    const post = await postModel.find(req.query).populate("profiles")
    res.send(post)
  } catch (error) {
    next(error)
  }
})

postRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const post = await postModel.findById(id)
    if (post) {
      res.send(post)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading post list a problem occurred!")
  }
})

postRouter.post("/",
 async (req, res, next) => {
  try {
   
    const newpost = new postModel(req.body)
     const { _id } = await newpost.save()
     res.status(201).send(_id)
     
     
   } catch (error) {
     next(error)
   }
})
 
postRouter.put("/:id", async (req, res, next) => {
  try {
    const editPost = await postModel.findByIdAndUpdate(req.params.id, req.body)
   
    if (editPost) {
      res.send("post updated")
    } else {
      const error = new Error(`post with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

postRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletePost = await postModel.findByIdAndDelete(req.params.id)
    if (deletePost) {
      res.send("Deleted")
    } else {
      const error = new Error(`post with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

postRouter.post("/:id/upload", upload.single("post"), async (req, res, next) => {
    try {
      await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
      req.body = {
        image: `http://127.0.0.1:${port}/images/post/${req.params.id}.png`
      }
      
      const post =await postModel.findByIdAndUpdate(req.params.id, req.body)
      if(post){
          res.send("image uploaded")
      }
      
    } catch (error) {
      next(error)
    }
  })


module.exports = postRouter

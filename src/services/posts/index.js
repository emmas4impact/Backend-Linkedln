const express = require("express")

const PostSchema = require("./schema")

const postRouter = express.Router()

postRouter.get("/", async (req, res, next) => {
  try {
    const post = await PostSchema.find(req.query)
    res.send(post)
  } catch (error) {
    next(error)
  }
})

postRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const post = await PostSchema.findById(id)
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
   
    const newpost = new PostSchema(req.body)
     const { _id } = await newpost.save()
     res.status(201).send(_id)
     
     
   } catch (error) {
     next(error)
   }
})
 
postRouter.put("/:id", async (req, res, next) => {
  try {
    const editPost = await PostSchema.findByIdAndUpdate(req.params.id, req.body)
   
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
    const deletePost = await PostSchema.findByIdAndDelete(req.params.id)
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

module.exports = postRouter

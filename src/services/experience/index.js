const express = require("express")

const ExperienceSchema = require("./schema")
const {check, body, validationResult} = require("express-validator");
const experienceRouter = express.Router()

experienceRouter.get("/", async (req, res, next) => {
  try {
    const experience = await ExperienceSchema.find(req.query)
    res.send(experience)
  } catch (error) {
    next(error)
  }
})

experienceRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params._id
    const experience = await ExperienceSchema.findById(_id)
    if (experience) {
      res.send(experience)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading experience list a problem occurred!")
  }
})

experienceRouter.post("/",
 async (req, res, next) => {
  try {
   
    const newExperience = new ExperienceSchema(req.body)
     const { _id } = await newExperience.save()
     res.status(201).send(_id)
     
     
   } catch (error) {
     next(error)
   }
})
 
experienceRouter.put("/:id", async (req, res, next) => {
  try {
    const experience = await ExperienceSchema.findByIdAndUpdate(req.params.id, req.body)
    console.log(experience)
    if (experience) {
      res.send("Ok")
    } else {
      const error = new Error(`Experience with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

experienceRouter.delete("/:id", async (req, res, next) => {
  try {
    const experience = await ExperienceSchema.findByIdAndDelete(req.params.id)
    if (experience) {
      res.send("Deleted")
    } else {
      const error = new Error(`Experience with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = experienceRouter

const express = require ("express")
const ProfilesModel = require("./schema")
const ExperienceSchema = require("../experience/schema")
const profileRouter = express.Router()
const multer = require("multer")
const path =require("path")
const upload = multer({});
const fs =require("fs-extra")
const imagePath = path.join(__dirname, "../../../public/images/profile");
console.log(imagePath)
const port = process.env.PORT

// get profiles

profileRouter.get("/", async(req,res,next)=>{
    try{
        const profiles = await ProfilesModel.find(req.query).populate('experience')
        // res.send(profiles)
        res.send({profiles, Total: profiles.length})

    }catch(error){
        next(error)
    }
})

// get profile with username
profileRouter.get("/:username", async(req,res,next)=>{
    try{
        //const username = req.params.username
        const profile = await ProfilesModel.findOne({'username': req.params.username})
        if(profile){
            res.send(profile)
        }else{
            const error = new Error()
            error.httpstatusCode =404
            next(error)
        }
    }catch(error){
        next(error)
    }
    
})

// create a new profile
profileRouter.post("/", async(req,res,next)=>{
    try{
        const newProfile = new ProfilesModel(req.body)
        const response = await newProfile.save()
        res.status(201).send(response)

    }catch(error){
        next(error)
    }
})

// update a new profile
profileRouter.put("/:username", async(req,res,next)=>{
    try{
        const profile = await ProfilesModel.findOneAndUpdate(req.params.username,req.body )
        if(profile){
            res.send("ok")
        }else{
            const error = new Error(`profile with username ${req.params.usernme}not found`)
            error.httpstatusCode = 404
            next(error)
        }

    }catch(error){
        next(error)
    }
})

// delete aa profile
profileRouter.delete("/:username", async(req,res,next)=>{
    try{
        const profile= await ProfilesModel.findOneAndDelete({'username': req.params.username})
        if(profile){
            res.send("deleted")
        }else{
            const error = new Error("profile with username ${req.params.username} not found")
            error.httpstatusCode=404
            next(error)
        }
    }catch(error){
        next(error)
    }
})

profileRouter.post("/:id/upload", upload.single("profile"), async (req, res, next) => {
    try {
      await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
      req.body = {
        image: `https://linkedln-backend.herokuapp.com/images/post/${req.params.id}.png`
      }
      
      const post =await ProfilesModel.findByIdAndUpdate(req.params.id, req.body)
      if(post){
          res.send("image uploaded")
      }
      
    } catch (error) {
      next(error)
    }
  })
//EXPERIENCE

profileRouter.get("/:username/experience", async (req, res, next) => {
    try {
     const experience = ExperienceSchema.findOne({'username': req.params.username})
     if(experience){
         res.send(experience)
         
     }
    //  else{
    //      res.send("wrong username")
    //  }
     
    } catch (error) {
      next(error)
    }
  })
  
//   profileRouter.get("/:username/experience/:id", async (req, res, next) => {
//     try {
//       const id = req.params.id
//       const experience = await ExperienceSchema.findById(id)
//       if (experience) {
//         res.send(experience)
//       } else {
//         const error = new Error()
//         error.httpStatusCode = 404
//         next(error)
//       }
//     } catch (error) {
//       console.log(error)
//       next("While reading experience list a problem occurred!")
//     }
//   })
  
  profileRouter.post("/:username/experience",
   async (req, res, next) => {
    try {
     
      const newExperience = new ExperienceSchema(req.body)
       const { _id } = await newExperience.save()
       res.status(201).send(_id)
       
       
     } catch (error) {
       next(error)
     }
  })
  
  profileRouter.post("/:username/experience/csv", async (req, res, next) => {
    try {
     
      const newExperience = new ExperienceSchema(req.body)
       const { _id } = await newExperience.save()
       //res.status(201).send(_id)
       
       const json2csv = new Transform( {fields:['_id', 'role', 'company', 'startDate', 'endDate', 'description', 'area','username','image', 'createdAt','updatedAt']})
      
       const data =json2csv({data: newExperience, fields: fields, fieldNames: fieldNames}) 
       res.attachment('filename.csv');
       res.status(200).send(data);
     } catch (error) {
       next(error)
     }
  })
  
  
  profileRouter.post("/:username/experience/:id/upload", upload.single("experience"), async (req, res, next) => {
    try {
      await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
      req.body = {
        image: `http://127.0.0.1:${port}/images/experience${req.params.id}.png`
      }
      
      const post =await ExperienceSchema.findByIdAndUpdate(req.params.id, req.body)
      if(post){
          res.send("image uploaded")
      }
      
    } catch (error) {
      next(error)
    }
  })
   
  profileRouter.put("/:username/experience/:id", async (req, res, next) => {
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
  
  profileRouter.delete("/:username/experience/:id", async (req, res, next) => {
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
module.exports = profileRouter
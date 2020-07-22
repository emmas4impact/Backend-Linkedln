const express = require ("express")
const ProfilesModel = require("./schema")
const q2m = require("query-to-mongo")
const multer = require("multer")
const path = require("path")
const fs = require("fs-extra")
const json2csv = require("json2csv");
const ExperienceModel = require("../experience/schema");
//const doc = new pdfdocument();
const { json } = require("express");
const pdfdocument = require("pdfkit");
const { profile } = require("console")

const profileRouter = express.Router()

// get profiles

profileRouter.get("/", async(req,res,next)=>{
    try{
        const profiles = await ProfilesModel.find(req.query)
        res.status(200).send(profiles)

    }catch(error){
        next(error)
    }
})

// get profiles with pagination, filter
profileRouter.get("/", async(req,res,next)=>{
    try{
        const query = q2m(req.query);
        const profiles = await ProfilesModel
        .find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)
        res.send({
            data:profiles,
            total:profiles.length
        })

    }catch(error){
        next(error)
    }
})

// get profile with username
profileRouter.get("/:username", async(req,res,next)=>{
    try{
        const username = req.params.username
        const profile = await ProfilesModel.findOne({username:username})
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

// get profiles with experience
profileRouter.get("/:username/experiences", async (req, res, next) => {
    try {
      const username = req.params.username
      const experience = await ExperienceModel.findOne({username:username})
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
// create a new profile with experience
profileRouter.post("/:username/experiences",async (req, res, next) => {
  try {
   
    const newExperience = new ExperienceModel(req.body)
     const response = await newExperience.save()
     res.status(201).send(response)
     
   } catch (error) {
     next(error)
   }
})

// get a specific experience for a particular user
profileRouter.get("/:username/experiences/:expId", async (req, res, next) => {
    try {
      const findUserExp = await ExperienceModel.findOne(
        {
          username: req.params.username,
          expId: req.params.id,
        },
        
      );
      if (findUserExp) {
          res.status(200).send(findUserExp)
      }else{
       res.status(404).send("Not found")
      };
    } catch (error) {
      next(error);
    }
  });

  // update a particular experience
 
profileRouter.put("/:username/experiences/:expId", async (req, res, next) => {
    try {
      delete req.body.username;
  
      const updateExperience = await ExperienceModel.findOneAndUpdate(
        {
          username: req.params.username,
          expId: req.params.id,
        },
        req.body
      );
      if (updateExperience) {
          res.status(200).send("Updated")
      }
      else {
          res.status(404).send("Request not successful")
      }
    } catch (error) {
      next(error);
    }
  });

  // delete  experience for a specific user
  profileRouter.delete("/:username/experiences/:expId", async (req, res, next) => {
    try {
      const delExp = await ExperienceModel.findOneAndDelete({
        username: req.params.username,
        expId: req.params.id,
      });
  
      if (delExp) { 
        res.status(200).send("Deleted");
      } else res.status(400).send("Bad request");
    } catch (error) {
      next(error);
    }
  });

  // post pic for an experience
 const uploaded = multer({})
  profileRouter.post(
    "/:username/experiences/:expId/picture",
    uploaded.single("picture"),
    async (req, res, next) => {
      try {
        await fs.writeFile(
          join(imageFilePath, `${req.params.id}.png`),
          req.file.buffer
        );
  
        const savePicture = await ExperienceModel.findByIdAndUpdate(
          { expId: req.params.id },
          {
            image: `http://localhost:${process.env.PORT}/img/experiences/${req.params.id}.png`,
          }
        );
        if (savePicture) res.status(201).send("Uploaded");
        else res.status(400).send("Something went wrong");
      } catch (error) {
        console.log(error);
      }
    }
  );

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

// post an image
const upload = multer({})
const imageFilePath = path.join(__dirname, "../../public/images/experience")
profileRouter.post("/:id/upload", upload.single("profile"), async (req,res,next)=>{
    try{
        if(req.file){
            await fs.writeFile(
                path.join(imageFilePath, `${req.params.id}.png`),
                req.file.buffer);
                const profile = await ProfilesModel.findOneAndUpdate(req.params.id, {
                    image:`http://127.0.0.1:${process.env.PORT}/img/profile/${req.params.id}.png`,
                });
                res.status(200).send("uploaded")
        }else{
            const error = new Error()
            error.httpstatusCode=400;
            error.message= "image file is missing"
            next(error)
        }

    }catch(error){
        next(error)
    }
})


// update a new profile
profileRouter.put("/:id", async(req,res,next)=>{
    try{
        const updatedProfile = await ProfilesModel.findByIdAndUpdate(req.params.id,req.body );
        if(updatedProfile){
            res.send(updatedProfile)
        }else{
            const error = new Error(`profile with id ${req.params.id}not found`)
            error.httpstatusCode = 404
            next(error)
        }

    }catch(error){
        next(error)
    }
})

// delete aa profile
profileRouter.delete("/:id", async(req,res,next)=>{
    try{
        const profile= await ProfilesModel.findByIdAndDelete(req.params.id)
        if(profile){
            res.send("deleted")
        }else{
            const error = new Error("profile with id${req.params.id} not found")
            error.httpstatusCode=404
            next(error)
        }
    }catch(error){
        next(error)
    }
})
profileRouter.get("/:username/experience", async (req, res, next) => {
    try {
      const id = req.params.id
      const experience = await ExperienceModel.findOne({'username': req.params.username})
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
//create pdf
profileRouter.get("/:username/pdf", async (req, res, next) => {
    try {
      const profile = await ProfilesModel.findOne({
        username: req.params.username,
      });
      const getExperience = await ExperienceModel.find({ username: profile.username });
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${profile.name}.pdf`
      );
      const doc = new pdfdocument()
      const photo = path.join(imageFilePath, `${profile._id}.png`);
      doc.pipe(fs.createWriteStream(path.join(__dirname, "../../public/images/pdf/output.pdf")));
      doc.font("Times-Roman");
      doc.fontSize(18);
      doc.image(photo, 88, 30, {
        fit: [100, 100],
      });
      doc.text(`${profile.name} ${profile.surname}`, {
        width: 410,
        align: "center",
      });
      doc.text(" ");
      doc.text("Experiences", {
        width: 410,
        align: "center",
      });
      doc.fontSize(12);
      getExperience.forEach(
        (exp) =>
          doc.text(`
          Role: ${exp.role}
          Company: ${exp.company}
          Starting Date: ${exp.startDate.toString().slice(4, 15)}
          Ending Date: ${exp.endDate.toString().slice(4, 15)}
          Description: ${exp.description}
          Area:  ${exp.area}
          -------------------------------------------------------
        `),
        {
          width: 410,
          align: "center",
        }
      );
  
      // doc.image(imagePath,`${profile._id}.png`, {
      //   fit: [250, 300],
      //   align: 'center',
      //   valign: 'center'
      // })
      doc.pipe(res);
      doc.end();
    } catch (error) {
      next(error);
    }
  });
  

module.exports = profileRouter;
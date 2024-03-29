const express = require ("express")
const ProfilesModel = require("./schema")
const ExperienceSchema = require("../experience/schema")
const profileRouter = express.Router()
const multer = require("multer")
const path =require("path")
const upload = multer({});
const PdfPrinter =require("pdfmake")
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

//tested ok
// update a new profile
profileRouter.put("/:username", async(req,res,next)=>{
    try{
        const profile = await ProfilesModel.findOneAndUpdate({'username': req.params.username},req.body )
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

profileRouter.post("/:id/upload", upload.single("profile"), async (req, res, next) => {
    try {
      await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
      req.body = {
        image: `https://linkedln-backend.herokuapp.com/images/profile/${req.params.id}.png`
      }
      
        const post =await ProfilesModel.findByIdAndUpdate(req.params.id, req.body)
      if(post){
          res.send("image uploaded")
      }
      
    } catch (error) {
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


//EXPERIENCE
//tested ok!
profileRouter.get("/:username/experience", async (req, res, next) => {
    try {
     //const experience = ExperienceSchema.find({'username': req.params.username})
     const experience = await ExperienceSchema.find({'username': req.params.username})
     console.log(experience)
     if(experience){
         res.send(experience)
        
     }
     else{
         res.send("wrong username")
     }
     
    } catch (error) {
      next(error)
    }
  })
  
  //tested ok
  profileRouter.get("/:username/experience/:id", async (req, res, next) => {
    try {
     //const experience = ExperienceSchema.find({'username': req.params.username})
     const experience = await ExperienceSchema.findById(req.params.id)
     console.log(experience)
     if(experience){
         res.send(experience)
        
     }
     else{
         res.send("wrong username")
     }
     
    } catch (error) {
      next(error)
    }
  })

  //tested ok!
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
  
  //tested ok!
  
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
  
  //tested ok!
  profileRouter.post("/:username/experience/:id/upload", upload.single("experience"), async (req, res, next) => {
    try {
      await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
      req.body = {
        image: `https://linkedln-backend.herokuapp.com/images/experience/${req.params.id}.png`
      }
      
      const post =await ExperienceSchema.findByIdAndUpdate(req.params.id, req.body)
      if(post){
          res.send("image uploaded")
      }
      
    } catch (error) {
      next(error)
    }
  })
   //tested ok!
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
  
  //tested ok
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
  
  //tested ok
  profileRouter.get('/:username/cv', async (req, res, next) => {
    try {
      const user = await ProfilesModel.findOne({ 'username': req.params.username })
      const experience = await ExperienceSchema.find({'username': req.params.username})
      
      if (user && !experience) {
          
        var fonts = {
          Roboto: {
            normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
            bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
            italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
            bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
          }
        };
        const printer = new PdfPrinter(fonts);
        const docDefinition = {
          pageMargins: [150, 50, 150, 50],
      
         
          content: [
        
            { text: `This is information about ${user.name}`, style: [ 'header', 'anotherStyle' ]},
            {
              image: `${path.join(imagePath, `${req.params.username}.png`)}`,
              width: 150,
              style: 'anotherStyle'
            },
            { text: `${user.name}`, style: [ 'header', 'anotherStyle' ]},
            { text: `${user.surname}`, style: [ 'header', 'anotherStyle' ]},
            { text: `${user.email}`, style: [ 'header', 'anotherStyle' ]},
            { text: `${user.bio}`, style: [ 'header', 'anotherStyle' ]},
            { text: `${user.title}`, style: [ 'header', 'anotherStyle' ]},
            { text: `${user.area}`, style: [ 'header', 'anotherStyle' ]}
          
          ], 
          styles: {
            header: {
              fontSize: 10,
              bold: true,
            
          
            },
            anotherStyle: {
              italics: true,
              alignment: 'center'
            }
          }
        }
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        
        
        res.setHeader("Content-Disposition", `attachment; filename=${user.name}.pdf`)
        res.contentType("application/pdf")
        pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, `../../../public/pdf/${user.name}.pdf`)))
        
        pdfDoc.end()
        res.send("done")
      }else if(user && experience){
        var fonts = {
            Roboto: {
              normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
              bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
              italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
              bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
            }
          };
          const printer = new PdfPrinter(fonts);
          experience.map(exp => {
            const docDefinition = {
                pageMargins: [150, 50, 150, 50],
            
              
                content: [
              
                  { text: `This is information about ${user.name}`, style: [ 'header', 'anotherStyle' ]},
                  {
                    image: `${path.join(imagePath, `${req.params.username}.png`)}`,
                    width: 150,
                    style: 'anotherStyle'
                  },
                  { text: `${user.name}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${user.surname}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${user.email}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${user.bio}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${user.title}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${user.area}`, style: [ 'header', 'anotherStyle' ]},
                  
                  { text: `${exp.role}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${exp.company}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${exp.startDate}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${exp.endDate}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${exp.description}`, style: [ 'header', 'anotherStyle' ]},
                  { text: `${exp.image}`, style: [ 'header', 'anotherStyle' ]}
                
                ], 
                styles: {
                  header: {
                    fontSize: 10,
                    bold: true,
                  
                
                  },
                  anotherStyle: {
                    italics: true,
                    alignment: 'center'
                  }
                }
              }
              const pdfDoc = printer.createPdfKitDocument(docDefinition);
          
            res.setHeader("Content-Disposition", `attachment; filename=${user.name}.pdf`)
          res.contentType("application/pdf")
          pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, `../../../public/pdf/${user.name}.pdf`)))
          
          pdfDoc.end()
          res.send("done")
          })
         
          
          
            //  pdfDoc
            //  .fill('black')
            //  .text(`Name: ${user.name}`, 20, 10)
            //  .text(` Surname: ${user.surname}`, 20, 20)
            //  .text(` Email: ${user.email}`, 20, 30)
            //  .text(` Bio: ${user.bio}`, 20, 40)
            //  .text(` Title: ${user.title}`, 20, 50)
            //  .text(`Area: ${user.area}`, 20, 60);
          // pdfDoc
          //    .save()
          //    .moveTo(100, 150)
          //    .lineTo(100, 250)
          //    .lineTo(200, 250)
          //    .fill('grey'); 
          
        
          
      }
      else res.status(404).send('not found!')
    } catch (error) {
      next(error)
    }
  })
module.exports = profileRouter
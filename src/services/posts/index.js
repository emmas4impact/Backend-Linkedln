const express = require("express")
const multer = require("multer")
const PDFDocument = require('pdfkit');
const postModel = require("./schema")
const path =require("path")
const fs =require("fs-extra")
const postRouter = express.Router()
const profileSchema = require("../profile/schema")
const q2m = require("query-to-mongo")
const port = process.env.PORT
const imagePath = path.join(__dirname, "../../../public/images/post");
console.log(imagePath)
const upload = multer({});




postRouter.get("/", async (req, res, next) => {
  try {
   
    const post = await postModel.find(req.query).populate("user")
    res.send(post)
  } catch (error) {
    next(error)
  }
})

postRouter.get("/:username", async (req, res, next) => {
  try {
   // const id = req.params.id
    const post = await postModel.findOne({'username': req.params.username})
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

postRouter.post("/:username",
 async (req, res, next) => {
  try {
    const post= await postModel.findOne({ 'username': req.params.username })
    const profileId= await profileSchema.findOne({'username':  req.params.username}).populate('user')
    if(post&&profileId){
       
    
            const newpost = new postModel({...req.body, username: `${req.params.username}`, user: `${profileId._id}`} )
            // req.body = {
            //     username:`${req.params.username}`
            //   }
          
            await newpost.save()
             res.status(201).send(newpost)
             
            
            
      
       
    }
    
     
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

postRouter.post("/:userId/upload", upload.single("post"), async (req, res, next) => {
    try {
      await fs.writeFile(path.join(imagePath, `${req.params.userId}.png`), req.file.buffer)
      const post =await postModel.findByIdAndUpdate(req.params.userId, 
                                                   { image: `https://linkedln-backend.herokuapp.com/images/post/${req.params.userId}.png`
                                                     })
      if(post){
          
          res.send("image uploaded")  
      }
      
    } catch (error) {
      next(error)
    }
  })
postRouter.post("/pdf", async(req, res, next)=>{
    try {
        const newpost = new postModel(req.body)
        console.log(newpost)
        const { _id } = await newpost.save()
        res.status(201).send(_id)
       
         const doc = new PDFDocument();  
         doc.pipe(fs.createWriteStream(path.join(__dirname, `../../../public/pdf/${newpost.username}.pdf`))) 
         doc.image('public\\images\\experience\\5f160c20969d033aa4615bd8.png', {
            fit: [100, 300],
            align: 'center',
            valign: 'center'
          }); 
         doc
            .font('fonts/Roboto-Regular.ttf')
            .fontSize(25)
            .text(newpost, 250, 200)  
            .fill('#000');
           
            doc.end() 
    } catch (error) {
        next(error)
    }
})

module.exports = postRouter

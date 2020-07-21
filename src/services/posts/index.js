const express = require("express")
const multer = require("multer")
// const PostSchema = require("./schema")
const postModel = require("./schema")
const path =require("path")
const fs =require("fs-extra")
const postRouter = express.Router()
const pdfPrinter = require("pdfmake")
const q2m = require("query-to-mongo")
const port = process.env.PORT
const imagePath = path.join(__dirname, "../../../public/images/post");
console.log(imagePath)
const upload = multer({});




postRouter.get("/", async (req, res, next) => {
  try {
    // const parsedQuery = q2m(req.query)
    // const post = await postModel.find(parsedQuery.criteria, parsedQuery.options.fields).populate("profile")
    // .sort(parsedQuery.options.sort)
    // .limit(parsedQuery.options.limit).skip(parsedQuery.options.skip)
    const post = await postModel.find(req.query).populate("user")
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
postRouter.post("/pdf", async(req, res, next)=>{
    try {
        const newpost = new postModel(req.body)
        console.log(newpost)
        const { _id } = await newpost.save()
        res.status(201).send(_id)
       
        // function base64_encode(file) {
        //     var bitmap = fs.readFileSync(file);
        //     return new Buffer(bitmap).toString("base64");
        // }
        
        var fonts = {
            Roboto:{
               "normal": "fonts/Roboto-Regular.ttf",
                
            }
        }
        let printer = new pdfPrinter(fonts);
        
        const doc ={
            content: [
                (text= "Post text: "+ newpost.text),
                (image= "image: "+ newpost.image),
                (userId= "userid "+ newpost.user._id),
                (id= "PostID: "+ newpost._id),
                (createdAT= "Post date: "+newpost.createdAT)
            ]
        }
        let pdfDoc= printer.createPdfKitDocument(doc)
        pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, `../../../public/pdf/${newpost._id}.pdf`)))
        pdfDoc.end()
                
                //pathToAttachment = join(__dirname, `../../../public/pdf/${newpost._id}.pdf`)
                
    } catch (error) {
        next(error)
    }
})

module.exports = postRouter

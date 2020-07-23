const express = require("express")
const listEndpoints = require("express-list-endpoints")
const profileRouter = require("./services/profile")
const experienceRouter = require("./services/experience")
const postRoute = require("./services/posts")
const path = require("path")
const helmet = require("helmet")
const swaggerUi = require('swagger-ui-express');
const YAML = require("yamljs")
const mongoose = require("mongoose")
const {join}= require("path")

//const problematicRoutes = require("./service/ProblematicRoutes")


const cors = require("cors")

const {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
  
} = require("./errorHandler.js")

const server = express();
server.use(cors())
// server.use(express.static(join(__dirname, `../src`)))
server.use(helmet());
const port = process.env.PORT || 2250

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
  next()
}

const swaggerDocument = YAML.load(join(__dirname, "../apiDescription.yml"))


const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))

// Dev logging middleware
if (process.env.NODE_ENV === 'development'){
  server.use(morgan('dev'))
}

server.use(express.json())


server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)
//server.use(logger)

server.use(express.static(path.join(__dirname, `../public`)))
server.use("/api/posts", postRoute)
server.use("/api/profile", profileRouter)
server.use("/api/experience", experienceRouter)
// const whitelist = ["http://localhost:3000", "http://localhost:3001"]
// const corsOptions = {
//     origin: function (origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error("Not allowed by CORS"))
//       }
//     },
//   }

  server.use(cors())

// // ERROR HANDLERS

// server.use(notFoundHandler)
// server.use(unauthorizedHandler)
// server.use(forbiddenHandler)
// server.use(catchAllHandler)

console.log(listEndpoints(server))
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
mongoose
.connect ("mongodb+srv://oksana:ksena161997@cluster0.5shb2.mongodb.net/Linkedln-API", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))




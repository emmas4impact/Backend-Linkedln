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
const cors = require("cors")

const {
    badRequestHandler,
    notFoundHandler,
    genericErrorHandler,
} = require("../src/errorHandler")

const server = express();
// server.use(express.static(join(__dirname, `../src`)))
server.use(cors());
server.use(helmet());
const port = process.env.PORT || 2250

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
  next()
}

const swaggerDocument = YAML.load(join(__dirname, "../apiDescription.yml"))

server.use(loggerMiddleware)
const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
console.log(staticFolderPath)

server.use(express.json()) // Built in middleware
server.use("/api/posts", postRoute)

server.use("/api/profile", profileRouter)
server.use("/api/experience", experienceRouter)


//ERROR HANDLERS

//server.use(notFoundHandler)
server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))



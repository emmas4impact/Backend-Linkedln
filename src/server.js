const express = require("express")
const listEndpoints = require("express-list-endpoints")
const profileRouter = require("./services/profile")
const experienceRouter = require("./services/experience")
const postRoute = require("./services/posts")


const mongoose = require("mongoose")
const {join}= require("path")

//const problematicRoutes = require("./service/ProblematicRoutes")


const cors = require("cors")

// const {
//   notFoundHandler,
//   unauthorizedHandler,
//   forbiddenHandler,
//   catchAllHandler,
// } = require("./errorHandling")

const server = express()
// server.use(express.static(join(__dirname, `../src`)))

const port = process.env.PORT

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
  next()
}

server.use(cors())
server.use(express.json()) // Built in middleware
server.use(loggerMiddleware)

server.use("/posts", postRoute)

server.use("/api/profile", profileRouter)
server.use("/api/experience", experienceRouter)
// ROUTES
// server.use("/products", loggerMiddleware, productRouter)
// server.use("/reviews",loggerMiddleware, reviewRouter )
// server.use("/customers",loggerMiddleware, customerRouter)

// // ERROR HANDLERS

// server.use(notFoundHandler)
// server.use(unauthorizedHandler)
// server.use(forbiddenHandler)
// server.use(catchAllHandler)

console.log(listEndpoints(server))

mongoose
  .connect("mongodb+srv://oksana:ksena161997@cluster0.5shb2.mongodb.net/Linkedln-API", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))



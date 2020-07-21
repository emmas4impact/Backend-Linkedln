const express = require("express")
const listEndpoints = require("express-list-endpoints")
const profileRouter = require("./services/profile")
const experienceRouter = require("./services/experience")



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
  .connect("mongodb://localhost:27017/Linkedln-API", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(2250, () => {
      console.log("Running on port", 2250)
    })
  )
  .catch((err) => console.log(err))



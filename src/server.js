const express = require ("express")
const cors = require("cors")
const listEndpoints = require("express-list-endpoints")
const mongoose = require ("mongoose")
const dotenv = require("dotenv")
const profileRouter = require("../src/services/profile")
const morgan = require("morgan")
//const logger = require("../src/services/middleware")

dotenv.config()

const {
    notFoundHandler,
    badRequestHandler,
    genericErrorHandler,
} = require("./errorHandler")

const port = process.env.PORT || 3015

const server = express()

// Dev logging middleware
if (process.env.NODE_ENV === 'development'){
  server.use(morgan('dev'))
}
server.use(cors())
server.use(express.json())

server.use("/api/profile", profileRouter)
server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)
//server.use(logger)

mongoose
.connect ("mongodb+srv://oksana:ksena161997@cluster0.5shb2.mongodb.net/Linkedln-API", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(
    server.listen(port, () => {
        console.log(`something is running on port ${port}`)
    })

)
.catch((err)=> console.log(err))



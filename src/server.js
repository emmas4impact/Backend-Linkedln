const express = require ("express")
const cors = require("cors")
const listEndpoints = require("express-list-endpoints")
const mongoose = require ("mongoose")
const dotenv = require("dotenv")
const profileRouter = require("./routes/profile")

dotenv.config()

const {
    notFoundHandler,
    badRequestHandler,
    genericErrorHandler,
} = require("./errorHandler")

const port = process.env.PORT || 3015

const server = express()
server.use(cors())
server.use(express.json())
// server.use("/profile", profileRouter)

mongoose
.connect ("mongodb://localhost:27017//LinkedIn-API", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(
    server.listen(port, () => {
        console.log(`something is running on port ${port}`)
    })

)
.catch((err)=> console.log(err))



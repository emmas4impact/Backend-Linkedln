const express = require ("express")
const cors = require("cors")
const listEndpoints = require("express-list-endpoints")
const mongoose = require ("mongoose")
const profileRouter = require("./src/routes/profile")


const server = express()
server.use(cors())
server.use(express.json())
server.use("/api/profile", profileRouter)

mongoose.connect ("mongodb://localhost:27017//striveschool-ap")

const port = process.env.PORT || 3015
server.listen(port, () => {
    console.log(`something is running on port ${port}`)
})



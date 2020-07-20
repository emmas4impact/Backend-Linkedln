const badRequestHandler = (err,req,res,next) =>{
    if (error.httpStatusCode===400){
        res.status(400).send(err.message)
    }
}

const notFoundHandler = (err,req,res,next) => {
    if(err.httpStatusCode=== 404){
        res.status(404).send(err.message || "Resource not found!")
    }
        next(err)

}

// catch all
const genericErrorHandler = (err,req,re,next)=>{
    if (!resizeBy.headersSent){
        res.status(err.httpStatusCode || 500).send(err.message)
    }
}
module.exports = {
    badRequestHandler,
    notFoundHandler,
    genericErrorHandler
}
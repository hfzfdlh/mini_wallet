

function errorHandler(err,req,res,next){
    let status = 500
    let error = "Internal Server Error"
    console.log(err)
    if (err.name === "unauthorized"){
        status = 401
        error = "Invalid Token"
    } else if(err.name ==="missingXid"){
        status = 400
        error = {
            "customer_xid": ["Missing data for required field"]
        }
    } else if (err.name === "hasEnabled"){
        status = 400
        error = "Already enabled"
    }  else if (err.name === "isDisabled"){
        status = 404
        error = "Wallet disabled"
    } else if (err.name==="notDisabled"){
        status = 400
        error = "Input not given"
    }

    res.status(status).json({"status":"fail",data:{error}})
}
module.exports = errorHandler
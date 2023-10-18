const { verifyToken } = require("../helper/jwt");
const { Customer } = require('../models')

async function authorization(req,res,next){
    try{
        // console.log(req.headers)
        const {authorization} = req.headers

        const access_token = authorization.split(' ')[1]
    
        if (!access_token) throw{name:'unauthorized'}
        const payload = verifyToken(access_token)
        // console.log("PAYLOAD>>>" ,payload)

        const getCust = await Customer.findOne({where:{customer_xid:payload.id}})
        if (!access_token) throw{name:'unauthorized'}
        // console.log("getcust",getCust)
        req.cust = {
            id:getCust.id,
            customer_xid:getCust.customer_xid
        }
        next()

    
    } catch(err){
        next(err)
    }
   
}
module.exports = authorization
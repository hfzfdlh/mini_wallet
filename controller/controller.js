const { createToken } = require("../helper/jwt")
const {Customer, Wallet, Transaction, Deposit, Withdrawal, sequelize} = require("../models")



class Controller{
    static async init(req,res,next){
        try{
            const {customer_xid} = req.body
            console.log(req.body.customer_xid)
        if (!customer_xid) throw {name:'missingXid'}
        
        let newCust = await Customer.create({customer_xid})
        const createWallet = {
            owned_by:customer_xid,
            status:"disabled",
            enabled_at:null,
            balance:null
        }
        let newWallet = await Wallet.create(createWallet)

        const token = createToken(newCust.customer_xid)
        // console.log(token)
        res.status(201).json({status:"success",data:{token}})

        } catch(err){
            next(err)
        }
        
    }

    static async enableWallet(req,res,next){
        try {
            const {customer_xid} = req.cust
            // console.log("disini", req.cust)
            const getWallet = await Wallet.findOne({where:{owned_by:customer_xid}})

            if(getWallet.status === 'enabled') throw {name:'hasEnabled'}

            const status = "enabled"
            const enabled_at = new Date()
            const balance = 0
            const updateWallet = await Wallet.update({status,enabled_at,balance},{where:{owned_by:customer_xid}})

            const wallet = await Wallet.findOne({
                attributes: {exclude :['createdAt','updatedAt','disabled_at']}
            },{where:{owned_by:customer_xid}})

            res.status(201).json({status:"success",data:{wallet}})

        } catch (err) {
            next(err)
        }
    }

    static async viewBalance(req,res,next){
        try {
            const {customer_xid} = req.cust
            const wallet = await Wallet.findOne({
                attributes: {exclude :['createdAt','updatedAt','disabled_at']}
            },{where:{owned_by:customer_xid}})

            if(wallet.status === 'disabled') throw {name:'isDisabled'}

            res.status(200).json({status:"success",data:{wallet}})

        } catch (err) {
            next(err)
        }
    }

    static async viewTransactions(req,res,next){
        try {
            const {customer_xid} = req.cust
            const wallet = await Wallet.findOne({
                attributes: {exclude :['createdAt','updatedAt','disabled_at']}
            },{where:{owned_by:customer_xid}})

            if (wallet.status != 'enabled') throw {name:'isDisabled'}

            const transactions = await Transaction.findAll({
                where:{'wallet_id':wallet.id}
            },{
                attributes:{exclude :['wallet_id']}})
                res.status(200).json({status:"success",data:{transactions}})
        } catch (err) {
            next(err)
        }
    }

    static async deposit(req,res,next){
        const t = await sequelize.transaction()
        try {
            const {customer_xid} = req.cust
            const wallet = await Wallet.findOne({
                attributes: {exclude :['createdAt','updatedAt','disabled_at']}
            },{where:{owned_by:customer_xid}})

            const { amount, reference_id} = req.body

            
            console.log("WALLET>>>", wallet)
            await wallet.increment(['balance'], {by:amount, transaction:t})
            const addDeposit={
                status:'success',
                deposited_by:wallet.id,
                amount:amount,
                reference_id:reference_id,
                deposited_at: new Date()
            }

            const newTransaction={
                status:'success',
                wallet_id:wallet.id,
                amount:amount,
                type:'deposit',
                reference_id:reference_id,
                transacted_at: new Date()
            }

            const deposit = await Deposit.create(addDeposit,{transaction:t})
            const addTransaction = await Transaction.create(newTransaction,{transaction:t})

           

            await t.commit()
            res.status(201).json({status:"success",data:{deposit}})

        } catch (err) {
            await t.rollback()
            next(err)
        }
    }

    static async withdrawn(req,res,next){
        const t = await sequelize.transaction()
        try {
            const {customer_xid} = req.cust
            const wallet = await Wallet.findOne({
                attributes: {exclude :['createdAt','updatedAt','disabled_at']}
            },{where:{owned_by:customer_xid}})

            const { amount, reference_id} = req.body

            await wallet.decrement(['balance'], {by:amount, transaction: t})
            const addWithdrawn={
                status:'success',
                withdrawn_by:wallet.id,
                amount:amount,
                reference_id:reference_id,
                withdrawn_at: new Date()
            }

            const newTransaction={
                status:'success',
                wallet_id:wallet.id,
                amount:amount,
                type:'withdrawal',
                reference_id:reference_id,
                transacted_at: new Date()
            }

            const withdrawal = await Withdrawal.create(addWithdrawn,{transaction:t})
            const addTransaction = await Transaction.create(newTransaction,{transaction:t})

            await t.commit()
            res.status(201).json({status:"success",data:{withdrawal}})

        } catch (err) {
            await t.rollback()
            next(err)
        }
    }

    static async disableWallet(req,res,next){
        try {
            const {is_disabled} = req.body
            console.log("is disabled ", typeof(is_disabled))
            if (is_disabled == 'true'){
                const {customer_xid} = req.cust
                let wallet = await Wallet.findOne({
                    attributes: {exclude :['createdAt','updatedAt','disabled_at']}
                    },{where:{owned_by:customer_xid}})

                await wallet.update({status:'disabled',disabled_at:new Date(), enabled_at:null})
                wallet = await Wallet.findOne({
                    attributes: {exclude :['createdAt','updatedAt','enabled_at']}
                    },{where:{owned_by:customer_xid}})

                res.status(200).json({status:"success",data:{wallet}})
            }
            else{
                throw {name:'notDisabled'}
            }
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Controller
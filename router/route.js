const Controller = require('../controller/controller')
const authorization = require('../middlewares/authorization')
const multer  = require('multer')
const upload = multer()


const router = require('express').Router()

router.post('/init',upload.none(), Controller.init)
router.use(authorization)
router.post('/wallet',upload.none(), Controller.enableWallet)
router.get('/wallet',upload.none(), Controller.viewBalance)
router.get('/wallet/transactions', Controller.viewTransactions)
router.post('/wallet/deposits', upload.none(),Controller.deposit)
router.post('/wallet/withdrawals', upload.none(), Controller.withdrawn)
router.patch('/wallet',upload.none(),Controller.disableWallet)

module.exports =router
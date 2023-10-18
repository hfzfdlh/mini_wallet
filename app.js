if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const express = require('express')
const router = require('./router/route')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
const port = 3000



app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/api/v1',router)
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`listening to ${port}`)
})

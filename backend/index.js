const express = require('express')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app =express()
app.use(cors())
app.use(express.json()) //accept json data with post requests

//routes
app.use('/',require('./routes'))

//start server
app.listen(PORT, ()=>{
    console.log('server listening on port: ',PORT)
})
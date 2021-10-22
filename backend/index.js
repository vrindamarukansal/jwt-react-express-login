const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { login, verifyToken, updatePassword } = require('./controllers')

const PORT = process.env.PORT || 5000
const app =express()
app.use(cors())
app.use(express.json()) //accept json data with post requests

//routes
app.post('/login',login)
app.post('/update', verifyToken, updatePassword)


//start server
app.listen(PORT, ()=>{
    console.log('server listening on port: ',PORT)
})
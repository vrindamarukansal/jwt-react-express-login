const express = require('express')
const routes = express.Router()

const { login, verifyToken, updatePassword, logout } = require('./controllers')

routes.post('/login',login)
routes.post('/update', verifyToken, updatePassword)
routes.get('/logout', logout)

module.exports = routes
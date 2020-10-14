const express = require('express')
const routes = express.Router()
const jwt = require("jsonwebtoken")

const db = require('./lib/helper')



routes.get('/', (req, res) => {
    res.send({
        message: 'test'
    })
})

//log in
routes.post("/login", function (req, res, next) {
    const [user_name, password] = req.body;
})

//send private info to the user
routes.get("/profile", function (req, res, next) {
    
})



module.exports = routes
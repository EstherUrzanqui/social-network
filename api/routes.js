const express = require('express')
const routes = express.Router()
const jwt = require("jsonwebtoken")
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn")

const db = require('./lib/helper')
require("dotenv").config()

const supersecret = process.env.SUPER_SECRET

//log in
routes.post("/login", function (req, res, next) {
    const { user_name, password } = req.body;
    db(`SELECT * FROM user WHERE user_name = "${user_name}" AND password = "${password}";`)
        .then((results) => {
            if(results.data.length) {
                var token = jwt.sign({ userId: results.data[0].id }, supersecret)

                res.send({message: "User OK, here is your token", token})
            } else {
                res.status(404).send({message: "User not found!"})
            }
        })
})

//protected endpoint
routes.get("/profile", userShouldBeLoggedIn, function (req, res, next) {
    
    res.send({ message: `Here is the private data for user ${req.userId}!` })

})

module.exports = routes
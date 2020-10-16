const express = require('express')
const routes = express.Router()
const jwt = require("jsonwebtoken")
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const db = require('./lib/helper')
require("dotenv").config()

const supersecret = process.env.SUPER_SECRET

//sign in
routes.post("/register", (req, res) => {
    const { user_name, email, password, password2 } = req.body;
    let errors = []

    //check required inputs
    if(!user_name || !email || !password || !password2){
        errors.push({message: "Please fill all required fields"})
        res.send({message: "Please fill all required fields"})   
    }

    //check passwords
    if(password != password2) {
        console.log("Passwords do not match")
        errors.push({message: "Passwords do not match"})
        res.send({message: "Passwords do not match"})
    }

    if(errors.length>0) {

    } else {
        if(email) {
            db(`SELECT * FROM user WHERE email = "${email}"`)
            .then((results) => {
                if(results.length>0){
                    res.send("Email exists")
                } else {
                    res.send("Registration successful")
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        if(err)throw err;
                        req.body.password = hash
                        db(`INSERT INTO user (user_name, email, password) VALUES ("${user_name}", "${email}", "${password}")`)
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
        } else {
            res.send("Enter email")
        }
    }
})

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
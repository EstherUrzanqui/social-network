const express = require('express')
const routes = express.Router()
const jwt = require("jsonwebtoken")
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const db = require('./lib/helper')
require("dotenv").config()

const supersecret = process.env.SUPER_SECRET

//post a share
routes.post("/profile/share", (req, res) => {
    let { user_id, body, createdAt, updatedAt } = req.body;
    
    db(`INSERT INTO shares (user_id, body, createdAt, updatedAt) 
        VALUES ('${user_id}', '${body}', '${createdAt}', '${updatedAt}'); 
        `)
        .then(results => {
            if(!results.error) {
                res.status(201).send({})
            }
            res.send(results)
        })
        .catch(err => res.status(500).send(err))
})

//get all shares
routes.get("/profile/shares", (req, res) => {

    db(`SELECT shares.body, 
        shares.createdAt, 
        user.user_name 
        FROM shares 
        INNER JOIN user 
        ON user.id = shares.user_id
        ORDER BY createdAt DESC`)
        .then(results => {
            if (results.error) {
                res.status(400).send({ message: "There was an error" });
            }
    
            res.send(results.data);
        });
})

//get shares by user id
routes.get("/profile/shares/:user_id", (req, res) => {
    const {user_id} = req.params
    db(`SELECT * FROM shares WHERE user_id='${user_id}' ORDER BY createdAt DESC`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//user by id
routes.get("/users/:id", (req, res) => {
    const { id } = req.params
    db(`SELECT * FROM user WHERE id='${id}'`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//follow user
routes.post("/users/:id/follow/:followId", (req, res) => {
    const { id, followId } = req.params
    const { createdAt, updatedAt } = req.body
    db(`INSERT INTO relationships (followerId, followedId, createdAt, updatedAt)
        VALUES ('${id}', '${followId}', '${createdAt}', '${updatedAt}')`)
        .then(results => {
            if(!results.error) {
                res.status(201).send({})
            }
            res.send(results)
        })
        .catch(err => res.status(500).send(err))
})

//sign in
routes.post("/register", (req, res) => {
    let { user_name, email, password, password2 } = req.body;
    let errors = []

    //check required inputs
    if(!user_name || !email || !password || !password2){
        errors.push({message: "Please fill all required fields"})
        res.send({message: "Please fill all required fields"})   
    }

    //check passwords
    if(password != password2) {
        console.log("Passwords do not match")
        console.log(password)
        console.log(password2)
        errors.push({message: "Passwords do not match"})
        res.send({message: "Passwords do not match"})
    }

    if(errors.length>0) {
        console.log(errors);
    } else {
        if(email) {
            db(`SELECT * FROM user WHERE email = "${email}"`)
            .then((results) => {
                if(results.data.length>0){
                    res.send("Email exists")
                } else {
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                    password = hash
                    db(`INSERT INTO user (user_name, email, password) VALUES ("${user_name}", "${email}", "${password}")`)
                        .then((results) => {
                            res.send("Registration successful")
                            if(err)throw err;
                        })
                        .catch((error) => {
                            console.log(error)
                        })
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
    const { user_name, password } = req.body

        db(`SELECT * FROM user WHERE user_name ="${user_name}";`)
        .then((results) => {
            if(results.data.length > 0) {
                console.log(results)
                console.log(results.data[0].password)
                const comparision = bcrypt.compare(password, results.data[0].password)
                    if(comparision) {
                        var token = jwt.sign({ userId: results.data[0].id}, supersecret)
                        res.send({ message: "User OK, here is your token!", token })
                    }   
            } else {
                res.status(404).send({ message: "User not found!" })
            }
        })

    
})


//protected endpoint
routes.get("/profile", userShouldBeLoggedIn, function (req, res, next) {
    
    res.send({ message: `Here is the private data for user ${req.userId}!`, id: req.userId })

})

module.exports = routes
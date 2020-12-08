const express = require('express')
const routes = express.Router()
const jwt = require("jsonwebtoken")
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn")
const bcrypt = require("bcrypt")
const saltRounds = 10;
const multer = require("multer")

const db = require('./lib/helper')
require("dotenv").config()

const supersecret = process.env.SUPER_SECRET

//upload profile picture
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './client/public/img')
    },
    filename: function (req, file, cb) {
      if(file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, file.originalname);
      } else {
       cb(new MulterError('LIMIT_UNEXPECTED_FILE', file.originalname));
      }
    }
});
   
  const upload = multer({ storage: storage });

routes.post("/profile/:id/upload", upload.single("image"), (req, res, next) => {
    let { id } = req.params

    db(`UPDATE user SET image = '/img/${req.file.filename}' WHERE id = ${id}`)
    .then(results => {
        if(!results.error) {
            res.status(201).send({ message: 'file uploaded'})
            return
        }
        res.send(results)
    })
    .catch(err => res.status(500).send(err))
})

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

//all users
routes.get("/users", (req, res) => {
    db(`SELECT * FROM user`)
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
    const { followed, createdAt, updatedAt } = req.body

    db(`INSERT INTO relationships (followerId, followedId, followed, createdAt, updatedAt)
        VALUES ('${id}', '${followId}', '${followed}', '${createdAt}', '${updatedAt}')`)
        .then(results => {
            if(!results.error) {
                res.status(201).send({})
            }
            res.send(results)
        })
        .catch(err => res.status(500).send(err))
})

//unfollow user
routes.delete("/users/:id/unfollow/:followId", (req, res) => {
    const { id, followId } = req.params
    
    db(`DELETE FROM relationships WHERE followerId = ${id} AND followedId = ${followId}`)
    .then(results => {
        if(!results.error) {
            res.status(201).send({ message: unfollowed })
        }
        res.send(results)
    })
    .catch(err => res.status(500).send(err))
})

//get following users
routes.get("/users/:id/following", (req, res) => {
    const { id } = req.params

    db(`SELECT user_name FROM user AS u 
        INNER JOIN relationships AS r 
        ON u.id = r.followedId 
        AND r.followerId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//get count following users
routes.get("/users/:id/following/count", (req, res) => {
    const { id } = req.params

    db(`SELECT COUNT(*) FROM relationships where followerId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//get followers users
routes.get("/users/:id/followers", (req, res) => {
    const { id } = req.params

    db(`SELECT user_name FROM user AS u
        INNER JOIN relatinships AS r
        ON u.id = r.followerId
        AND r.followedId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//get count followers users
routes.get("/users/:id/followers/count", (req, res) => {
    const { id } = req.params

    db(`SELECT COUNT(*) FROM relationships where followedId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//sign up
routes.post("/register", (req, res, next) => {
    let { user_name, email, password, password2 } = req.body;
    let errors = []

    //check required inputs
    if(!user_name || !email || !password || !password2){
        errors.push({message: "Please fill all required fields"})
        res.send({message: "Please fill all required fields"})   
    }

    //check passwords
    if(password != password2) {
        errors.push({message: "Passwords do not match"})
        res.send({message: "Passwords do not match"})
    }

    if(errors.length>0) {
        console.log(errors);
    } else {
        if(email) {
            db(`SELECT * FROM user WHERE email = ${email}`)
            .then((results) => {
                if(results.data.length>0){
                    res.send("Email exists")
                } else {
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                    password = hash
                    db(`INSERT INTO user (user_name, email, password) VALUES (${user_name}, ${email}, ${password})`)
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
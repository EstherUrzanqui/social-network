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

//UPLOAD PROFILE PICTURE
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

    db(`UPDATE user SET image = '/img/${req.file.filename}' WHERE id = '${id}'`)
    .then(results => {
        if(!results.error) {
            res.status(201).send({ message: 'file uploaded'})
            return
        }
        res.send(results)
    })
    .catch(err => res.status(500).send(err))
})

//UPLOAD BACKGROUND IMAGE
routes.post("/profile/:id/uploadbackground", upload.single("background_image"), (req, res, next) => {
    let { id } = req.params

    db(`UPDATE user SET background_image = '/img/${req.file.filename}' WHERE id = '${id}'`)
    .then(results => {
        if(!results.error) {
            res.status(201).send({ message: 'file uploaded'})
            return
        }
        res.send(results)
    })
    .catch(err => res.status(500).send(err))
})

//EDIT USER DETAILS
routes.post("/profile/:id/edit/user_name", (req, res) => {
    let { id } = req.params
    let { user_name } = req.body;

    db(`UPDATE user SET user_name = '${user_name}' WHERE id = '${id}'`)
    .then((results) => {
        console.log(results)
        res.send("Your details have been updated successfuly")
    
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post("/profile/:id/edit/email", (req, res) => {
    let { id } = req.params
    let { email } = req.body;

    db(`UPDATE user SET email = '${email}' WHERE id = '${id}'`)
    .then((results) => {
        console.log(results)
        res.send("Your details have been updated successfuly")
    
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post("/profile/:id/edit/password", (req, res) => {
    let { id } = req.params
    let { password, password2 } = req.body;
    let errors = [];

    if(password != password2) {
        errors.push({message: "Passwords do not match"})
        res.send({message: "Passwords do not match"})

    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        password = hash
        db(`UPDATE user SET password = '${password}' WHERE id = ${id}`)
            .then((results) => {
                res.send("Password updated successfuly")
            })
            .catch((error) => {
                console.log(error)
            })
    })
    
})

//DELETE ACCOUNT
routes.delete("/profile/:id/edit/delete", (req, res) => {
    let { id } = req.params
    
    db(`DELETE user
        FROM user 
        WHERE user.id = ${id}
        `)
        .then((results) => {
            res.send({ message: "user deleted" })
        })
        .catch(err => res.status(500).send(err))
})

//POST A MESSAGE
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

//GET ALL MESSAGES
routes.get("/profile/shares", (req, res) => {

    db(`SELECT shares.body, 
        shares.createdAt, 
        user.user_name,
        user.image 
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

//GET POST BY USER ID
routes.get("/profile/shares/:user_id", (req, res) => {
    const {user_id} = req.params
    db(`SELECT * FROM shares WHERE user_id='${user_id}' ORDER BY createdAt DESC`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//GET ALL USERS
routes.get("/users", (req, res) => {
    db(`SELECT * FROM user`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//USER BY ID
routes.get("/users/:id", (req, res) => {
    const { id } = req.params
    db(`SELECT * FROM user WHERE id='${id}'`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//GET SUGGESTIONS TO FOLLOW
routes.get("/users/:id/suggestions", (req, res) => {
    const { id } = req.params

    db(`SELECT 
            * 
        FROM 
            user 
        WHERE 
            NOT EXISTS
            (
            SELECT 
                *
            FROM 
                relationships
            WHERE
                relationships.followerId = ${id}
            AND
                relationships.followedId = user.id
            )`
    )
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//FOLLOW USER
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

//UNFOLLOW USER
routes.delete("/users/:id/unfollow/:followId", (req, res) => {
    const { id, followId } = req.params
    
    db(`DELETE FROM relationships WHERE followerId = ${id} AND followedId = ${followId}`)
    .then(results => {
        if(!results.error) {
            res.status(201).send({ message: "unfollowed" })
        }
        res.send(results)
    })
    .catch(err => res.status(500).send(err))
})

//GET FOLLOWING USERS
routes.get("/users/:id/following", (req, res) => {
    const { id } = req.params

    db(`SELECT 
            user_name, image
        FROM 
            user 
        INNER JOIN 
            relationships ON user.id = relationships.followedId 
        AND 
            relationships.followerId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//GET COUNT FOLLOWING USERS
routes.get("/users/:id/following/count", (req, res) => {
    const { id } = req.params

    db(`SELECT COUNT(*) FROM relationships where followerId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//GET FOLLOWERS
routes.get("/users/:id/followers", (req, res) => {
    const { id } = req.params

    db(`SELECT 
            user_name, image 
        FROM 
            user 
        INNER JOIN 
            relationships ON user.id = relationships.followerId
        AND 
            relationships.followedId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//GET COUNT FOLLOWERS
routes.get("/users/:id/followers/count", (req, res) => {
    const { id } = req.params

    db(`SELECT COUNT(*) FROM relationships where followedId = ${id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//SIGN UP
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
            db(`SELECT * FROM user WHERE email = '${email}'`)
            .then((results) => {
                if(results.data.length>0){
                    res.send("Email exists")
            
                } else {
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                    password = hash
                    db(`INSERT INTO user (user_name, email, password, image, background_image) VALUES ('${user_name}', '${email}', '${password}','/img/default-user-icon-4.jpg', '/img/background default.jpg')`)
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



//LOG IN
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


//PROTECTED ENDPOINT
routes.get("/profile", userShouldBeLoggedIn, function (req, res, next) {
    
    res.send({ message: `Here is the private data for user ${req.userId}!`, id: req.userId })

})

module.exports = routes
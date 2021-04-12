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

//UPLOAD PICTURES IN MESSAGES
routes.post("/user/:id/uploadpicture", upload.single("pictures"), (req, res, next) => {
    let { id } = req.params

    db(`UPDATE shares SET pictures = '/img/${req.file.filename}' WHERE id = '${id}'`)
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

//GET ALL FOLLOWING USERS' MESSAGES
routes.get("/profile/shares/:id", (req, res) => {
    const { id } = req.params

    db(`SELECT 
            relationships.followedId,
            shares.id,
            shares.body,
            shares.createdAt,
            shares.pictures,
            user.user_name,
            user.image
        FROM shares 
        INNER JOIN relationships
        ON relationships.followerId = '${id}'
        AND relationships.followedId = shares.user_id
        INNER JOIN user
        ON user.id = shares.user_id
        ORDER BY createdAt DESC`
        )
        .then(results => {
            res.send(results.data);
        })
        .catch(err => res.status(500).send(err))
})

//GET MESSAGES BY USER ID
routes.get("/profile/:user_id", (req, res) => {
    const {user_id} = req.params
    db(`SELECT * FROM shares WHERE user_id='${user_id}' ORDER BY createdAt DESC`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//REPLY MESSAGES
routes.post("/profile/share/:shares_id/reply", (req, res) => {
    const { shares_id } = req.params
    const { user_id, body, createdAt } = req.body
    db(`INSERT INTO messages (user_id, body, createdAt, shares_id)
        VALUES ('${user_id}', '${body}', '${createdAt}', ${shares_id})`)
    .then(results => {
        if(!results.error) {
            res.status(201).send({})
        }
        res.send(results)
    })
    .catch(err => res.status(500).send(err))
})

//GET REPLIES
routes.get("/profile/share/:shares_id/comments", (req, res) => {
    const { shares_id } = req.params

    db(`SELECT
            user.user_name,
            user.image,
            messages.body,
            messages.createdAt,
            messages.shares_id
        FROM user
        INNER JOIN messages
        ON user.id = messages.user_id
        AND messages.shares_id = '${shares_id}'
        `)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//COUNT REPLIES 
routes.get("/profile/share/count/:shares_id", (req, res) => {
    const { shares_id } = req.params

    db(`SELECT COUNT(*) FROM messages where shares_id = ${shares_id} `)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//LIKES
routes.post("/profile/share/:shares_id/likes", (req, res) => {
    const { shares_id } = req.params
    
    db(`UPDATE shares SET likes = likes + 1 WHERE id = ${shares_id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//COUNT LIKES
routes.get("/profile/share/:shares_id/countlikes", (req, res) => {
    const { shares_id } = req.params

    db(`SELECT likes FROM shares WHERE id = ${shares_id}`)
    .then(results => {
        res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

//UNLIKE
routes.post("/profile/share/:shares_id/unlike", (req, res) => {
    const { shares_id } = req.params
    
    db(`UPDATE shares SET likes = likes - 1 WHERE id = ${shares_id}`)
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

//SEARCH BY KEYWORDS
routes.get("/search/:query", (req, res) => {
    const query = req.params.query
    db(`SELECT
            shares.body,
            shares.createdAt,
            user.user_name,
            user.image 
        FROM user
        INNER JOIN shares
        ON shares.body LIKE '%${query}%'
        OR user.user_name LIKE '%${query}%'
        `)
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
            )
        ORDER BY RAND()`
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
            user_name, image, user.id
        FROM 
            user 
        INNER JOIN 
            relationships ON user.id = relationships.followedId 
        AND 
            relationships.followerId = ${id}
        ORDER BY RAND()`)
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
            user_name, image, user.id 
        FROM 
            user 
        INNER JOIN 
            relationships ON user.id = relationships.followerId
        AND 
            relationships.followedId = ${id}
        ORDER BY RAND()`)
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
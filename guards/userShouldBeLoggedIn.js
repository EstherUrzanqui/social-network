var jwt = require("jsonwebtoken")
require("dotenv").config()
const supersecret = process.env.SUPER_SECRET

function userShouldBeLoggedIn(req, res, next) {
    const token = req.headers["x-access-token"]
    if(!token) {
        res.status(401).send({message: "Please send the token"})
    } else {
        jwt.verify(token, supersecret, function (err, decoded) {
            if(err) {
                res.status(401).send({message: err.message})
            } else {
                const { userId } = decoded;
                req.userId = userId;
                next()
            }
        })
    }
}

module.exports = userShouldBeLoggedIn
const jwt = require('jsonwebtoken')

const verifyUser = (req, res, next) => {
    console.log("Headers:", req.headers['authorization'])
    const token = req.headers['authorization'].split(" ")[1]
    jwt.verify(token, process.env.JWT_PASS, (err, decodeToken) => {
        console.log(decodeToken)
        if (err) {
            res.status(401).json({ message: "Unauthorized user " })
        } else {
            req.userId = decodeToken.id;
            next()
        }
    })
}

module.exports = verifyUser
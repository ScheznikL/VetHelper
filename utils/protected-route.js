const jwt = require("jsonwebtoken")
const {getOwnerByEmail} = require("../models/owners")
const {getVeterinarianByEmail} = require("../models/veterinarian")

const SECRET = "secretKey"
exports.SECRET = SECRET

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] ?? req.cookies.token ?? ""

  if (!token) {
    res.status(401).json({error: "Unauthorized"})
    return
  }

  try {
    const {email, type} = jwt.verify(token, SECRET)

    const user = type === "owner" ? await getOwnerByEmail(email) : await getVeterinarianByEmail(email)

    if (user && user[0]) {
      req.user = {...user[0], type}
      next()
    }
    else throw new Error("Can't find user!")
  } catch (error) {
    console.log("error", error.message)
    res.status(401).json({error: "Unauthorized"})
  }
}

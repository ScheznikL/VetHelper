const express = require("express")
const {
  handleOwnerLogin,
  handleOwnerRegister,
  handleVeterinarianLogin,
  handleVeterinarianRegister,
  getAuthPage, logout
} = require("../controllers/auth")
const router = express.Router()

router.get("/", (req, res) => res.redirect("/auth"))
router.get("/auth", getAuthPage)

router.get("/auth/owner/login", handleOwnerLogin)
router.get("/auth/owner/register", handleOwnerRegister)

router.get("/auth/veterinarian/login", handleVeterinarianLogin)
router.get("/auth/veterinarian/register", handleVeterinarianRegister)

router.get("/auth/logout", logout)

module.exports = router

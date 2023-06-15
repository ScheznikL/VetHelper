const {getOwnersList, getApplicationsList} = require("../models/owners")

exports.getOwners = async (req, res) => {
  const {type, pib} = req.user
  const owners = await getOwnersList()

  res.render("owners", {
    title: "Власники | Vet-Helper",
    activePage: "owners",
    user: {
      role: type,
      name: pib
    },
    owners
  })
}

exports.getMyPetsPage = async (req, res) => {
  const {type, pib, email} = req.user

  const pets = await getApplicationsList(email)

  res.render("mypets", {
    title: "Кабінет користувача | Vet-Helper",
    activePage: "mypets",
    user: {
      role: type,
      name: pib
    },
    pets
  })
}

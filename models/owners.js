const db = require("../utils/db")

exports.getOwnerByCredentials = async (email, password) => {
  const query = "SELECT * FROM owners WHERE email = ? AND password = ?"

  return await db.promise(query, [email, password])
}

exports.getOwnerByEmail = async (email) => {
  const query = "SELECT * FROM owners WHERE email = ?"

  return await db.promise(query, [email])
}

exports.addOwner = async (email, password, pib) => {
  const query = "INSERT INTO owners (email, password, pib) VALUES (?, ?, ?)"

  return await db.promise(query, [email, password, pib])
}

exports.getOwnersList = async () => {
  const query = `
    SELECT o.pib, o.email, GROUP_CONCAT(a.name) AS pets
    FROM owners o
    JOIN (SELECT DISTINCT name, ownerEmail FROM applications) a ON o.email = a.ownerEmail
    GROUP BY o.pib, o.email;
  `

  return await db.promise(query)
}

exports.getApplicationsList = async (email) => {
  const query = `
    SELECT name, dateOfApplication, reasonOfApplication, 
    receipt, ration, prevention, diagnosis, analyses 
    FROM applications 
    WHERE ownerEmail = ?
  `

  return await db.promise(query, [email])
}

const db = require("../utils/db")

exports.isVeterinarianExist = async (email, password) => {
  const query = "SELECT COUNT(*) AS count FROM veterinarians WHERE email = ? AND password = ?"

  const result = await db.promise(query, [email, password])

  return result[0].count > 0
}

exports.addVeterinarian = async (email, password, pib, position) => {
  const query = "INSERT INTO veterinarians (email, password, pib, position) VALUES (?, ?, ?, ?)"

  return await db.promise(query, [email, password, pib, position])
}

exports.getVeterinarianByEmail = async (email) => {
  const query = "SELECT * FROM veterinarians WHERE email = ?"

  return await db.promise(query, [email])
}

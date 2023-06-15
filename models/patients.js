const db = require("../utils/db")

exports.createNewApplication = async ({
  ownerEmail, veterinarianEmail, name, sex, age, type, dateOfApplication,
  reasonOfApplication, receipt, ration, prevention, diagnosis, analyses
}) => {
  const query = `
    INSERT INTO applications (
      ownerEmail, veterinarianEmail, name, sex, age, type, dateOfApplication, 
      reasonOfApplication, receipt, ration, prevention, diagnosis, analyses
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  return await db.promise(query, [
    ownerEmail, veterinarianEmail, name, sex, age, type, dateOfApplication,
    reasonOfApplication, receipt, ration, prevention, diagnosis, analyses
  ])
}

exports.getApplicationsList = async (veterinarianEmail) => {
  const query = "SELECT * FROM applications WHERE veterinarianEmail = ?"

  return await db.promise(query, [veterinarianEmail])
}

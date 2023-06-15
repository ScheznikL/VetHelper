const path = require("path")
const express = require("express")
const compression = require("compression")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const ownersRoutes = require("./routes/owners")
const patientsRoutes = require("./routes/patients")
const authRoutes = require("./routes/auth")

const PORT = process.env.PORT || 3000

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")))

app.use(ownersRoutes)
app.use(patientsRoutes)
app.use(authRoutes)

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`))

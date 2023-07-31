const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const cors = require("cors");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }))

// Load ENV variables
dotenv.config()

// Database connection URL
const mongodbUrl = process.env.DATABASE_ACCESS;

const allRoutes = require("./routes");


app.use(cors(
    {

    }
));

// Connect to Database
mongoose.connect(mongodbUrl, { useNewUrlParser: true })
    .then(() => { console.log("Database Connected") })
    .catch(e => console.log(e))



app.use(express.json());

app.use("/", allRoutes)

// Localhost port 4000 backend
app.listen(4000, () => {
    console.log("Server is up and running");
})
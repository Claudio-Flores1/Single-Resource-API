require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const path = require("path")

const Jacket = require('./models/jacket')


const DATABASE_URL = process.env.DATABASE_URL

const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log("An error occurred: \n", error))

const app = express()

app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("puublic"))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("The server is running correctly.")
})

app.get("/jackets/seed", (req, res) => {
    const startJackets = [
        { name: "Alpha SV", color: "24k", waterProof: true },
        { name: "Beta SV", color: "kingfisher", waterProof: true },
        { name: "Gamma MX", color: "black", waterProof: false },
        { name: "Beta Jacket", color: "offlime", waterProof: true },
        { name: "Atom LT", color: "timelapse", waterProof: false },
    ]

    Jacket.deleteMany({})
        .then(() => {
            Jacket.create(startJackets)
                .then(data => {
                    res.json(data)
                })
        })

})

app.get("/jackets", (req, res) => {
    Jacket.find({})
        .then(jackets => {
            res.json({ jackets: jackets })
        })
        .catch(err => console.log(err))
})

// POST request
// CREATE route -> gives the ability to create new fruits
app.post("/jackets", (req, res) => {
    Jacket.create(req.body)
        .then(jacket => {
            res.status(201).json({ jacket: jacket.toObject() })
        })
        .catch(error => console.log(error))
})

// SHOW request
// READ route -> finds and displays a single resource
app.get("/jackets/:id", (req, res) => {
    const id = req.params.id
    Jacket.findById(id)
        .then(jacket => {
            res.json({ jacket: jacket })
        })
        .catch(err => res.json(err))
})

// PUT request
// UPDATE route -> updates a specific fruit
app.put("/jackets/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    Jacket.findByIdAndUpdate(id, req.body, { new: true })
        .then(jacket => {
            console.log('the jacket from update', jacket)
            // update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE request
// DESTROY route -> finds and deletes a singel resource(fruit)
app.delete("/jackets/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    Jacket.findByIdAndRemove(id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => res.json(err))
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Single Source API: ${PORT}`))
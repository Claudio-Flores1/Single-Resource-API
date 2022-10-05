////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Jacket = require("../models/Jacket")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////


router.get("/", (req, res) => {
    Jacket.find({})
        .then(jackets => {
            res.json({ jackets: jackets })
        })
        .catch(err => console.log(err))
})

// POST request
// CREATE route -> gives the ability to create new fruits
router.post("/", (req, res) => {
    Jacket.create(req.body)
        .then(jacket => {
            res.status(201).json({ jacket: jacket.toObject() })
        })
        .catch(error => console.log(error))
})

// SHOW request
// READ route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id
    Jacket.findById(id)
        .then(jacket => {
            res.json({ jacket: jacket })
        })
        .catch(err => res.json(err))
})

// PUT request
// UPDATE route -> updates a specific fruit
router.put("/:id", (req, res) => {
    const id = req.params.id
    Jacket.findByIdAndUpdate(id, req.body, { new: true })
        .then(jacket => {
            console.log('the jacket from update', jacket)
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE request
// DESTROY route -> finds and deletes a singel resource(fruit)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    Jacket.findByIdAndRemove(id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => res.json(err))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
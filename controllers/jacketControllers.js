////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Jacket = require("../models/jacket")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////

router.get("/", (req, res) => {
    Jacket.find({})
        .populate("comments.author", "username")
        .then(jackets => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // console.log(fruits)
            // this is fine for initial testing
            // res.send(fruits)
            // this the preferred method for APIs
            // res.json({ fruits: fruits })
            // here, we're going to render a page, but we can also send data that we got from the database to that liquid page for rendering
            res.render('jackets/index', { jackets, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET for new fruit
// renders the form to create a jacket
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('jackets/new', { username, loggedIn, userId })
})

// GET request
// only jackets owned by logged in user
// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the jackets, by ownership
    Jacket.find({ owner: req.session.userId })
        // then display the fruits
        .then(jackets => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId

            // res.status(200).json({ fruits: fruits })
            res.render('jackets/index', { jackets, username, loggedIn, userId })
        })
        // or throw an error if there is one
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    const jacketId = req.params.id

    Jacket.findById(jacketId)
        .then(jacket => {
            res.render('jackets/edit', { jacket, username, loggedIn, userId })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

// CREATE route -> gives the ability to create new fruits
// POST request
router.post("/", (req, res) => {
    req.body.waterProof = req.body.waterProof === 'on' ? true : false
    req.body.owner = req.session.userId
    console.log('the jacket from the form', req.body)
    Jacket.create(req.body)
        .then(jacket => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            res.redirect('/jackets')
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// SHOW request
// READ route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id
    Jacket.findById(id)
        .populate("comments.author", "username")
        .then(jacket => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.json({ jacket: jacket })
            res.render('jackets/show', { jacket, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// PUT request
// UPDATE route -> updates a specific fruit
router.put("/:id", (req, res) => {
    console.log("req.body initially", req.body)
    const id = req.params.id

    req.body.waterProof = req.body.waterProof === 'on' ? true : false
    console.log('req.body after changing checkbox value', req.body)
    Jacket.findById(id)
        .then(jacket => {
            if (jacket.owner == req.session.userId) {
                res.sendStatus(204)
                return jacket.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            res.redirect(`/jackets/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// DELETE request
// DESTROY route -> finds and deletes a singel resource(fruit)
// router.delete("/:id", (req, res) => {
//     // grab the id from the request
//     const id = req.params.id
//     Jacket.findByIdAndRemove(id)
//         .then(() => {
//             res.sendStatus(204)
//         })
//         .catch(err => res.json(err))
// })

router.delete('/:id', (req, res) => {
    const jacketId = req.params.id

    Jacket.findByIdAndRemove(jacketId)
        .then(jacket => {
            res.redirect('/jackets')
        })
        .catch(error => {
            res.redirect(`/error?error=${err}`)
        })
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
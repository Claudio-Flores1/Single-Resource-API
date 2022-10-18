////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Jacket = require("../models/jacket")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// POST
// only loggedIn users can post comments
router.post("/:jacketId", (req, res) => {
    const jacketId = req.params.jacketId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        console.log("if statement")
        req.body.author = req.session.userId
    } else {
        console.log("else statement")
        res.sendStatus(401)
    }
    // find a specific fruit
    Jacket.findById(jacketId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the fruit?
        .then(jacket => {
            // push the comment into the fruit.comments array
            console.log(req.body)
            jacket.comments.push(req.body)
            // we need to save the fruit
            return jacket.save()
        })
        .then(jacket => {
            console.log(jacket.comments)
            res.redirect(`/jackets/${jacket.id}`)
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(err => res.redirect(`/error?error=${err}`))
})

// DELETE
// only the author of the comment can delete it
router.delete('/delete/:jacketId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const jacketId = req.params.jacketId 
    const commId = req.params.commId
    // get the fruit
    Jacket.findById(jacketId)
        .then(jacket => {
            // get the comment
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = jacket.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    jacket.save()
                    res.redirect(`/jackets/${jacket.id}`)
                    // return the saved jacket
                    // return jacket.save()
                } else {
                    const err = 'you%20are%20not%20authorized%20for%20this%20action'
                    res.redirect(`/error?error=${err}`)
                }
            } else {
                const err = 'you%20are%20not%20authorized%20for%20this%20action'
                res.redirect(`/error?error=${err}`)
            }
        })
        // send an error if error
        .catch(err => res.redirect(`/error?error=${err}`))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
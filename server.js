require("dotenv").config()
const express = require("express")
const path = require("path") 
const JacketRouter = require('./controllers/jacketControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = require('liquid-express-views')(express())

middleware(app)

/////////////////////////////////////////////
// Home Route
/////////////////////////////////////////////
app.get("/", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/jackets')
    } else {
        res.render('index.liquid')
    }
})

app.use('/jackets', JacketRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

app.get('/error', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const error = req.query.error || 'This page does not exist'

    res.render('error.liquid', { error, username, loggedIn, userId })
})

app.all('*', (req, res) => {
    res.redirect('/error')
})

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Single Source API: ${PORT}`))
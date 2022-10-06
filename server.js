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
const app = express()

middleware(app)

/////////////////////////////////////////////
// Home Route
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
})

app.use('/jackets', JacketRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Single Source API: ${PORT}`))
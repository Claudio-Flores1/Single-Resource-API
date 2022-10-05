/////////////////////////////////////////////////////
// Our schema and model for the fruit resource
/////////////////////////////////////////////////////
const mongoose = require('./connection')

const { Schema, model } = mongoose

// fruits schema
const jacketSchema = new Schema({
    name: String,
    color: String,
    waterProof: Boolean
})

const Jacket = model("Jacket", jacketSchema)

//////////////////////////////////////////////////
// Export our model
//////////////////////////////////////////////////
module.exports = Jacket
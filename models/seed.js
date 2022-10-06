///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Jacket = require('./jacket')

///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
const db = mongoose.connection

db.on('open', () => {
    const startJackets = [
        { name: "Alpha SV", color: "24k", waterProof: true, quantity: 2 },
        { name: "Beta SV", color: "kingfisher", waterProof: true, quantity: 8 },
        { name: "Gamma MX", color: "black", waterProof: false, quantity: 1 },
        { name: "Beta Jacket", color: "offlime", waterProof: true, quantity: 5 },
        { name: "Atom LT", color: "timelapse", waterProof: false, quantity: 7 },
    ]

    Jacket.deleteMany({})
        .then(deletedJackets => {
            console.log('this is what .deleteMany returns', deletedJackets)

            Jacket.create(startJackets)
                .then(data => {
                    console.log('here are the newly created jackets', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            db.close()
        })
})
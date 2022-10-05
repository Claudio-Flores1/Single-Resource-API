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
        { name: "Alpha SV", color: "24k", waterProof: true },
        { name: "Beta SV", color: "kingfisher", waterProof: true },
        { name: "Gamma MX", color: "black", waterProof: false },
        { name: "Beta Jacket", color: "offlime", waterProof: true },
        { name: "Atom LT", color: "timelapse", waterProof: false },
    ]

    Jacket.deleteMany({})
        .then(deletedJackets => {
            console.log('this is what .deleteMany returns', deletedJackets)

            Jacket.create(startJackets)
                .then(data => {
                    console.log('here are the newly created fruits', data)
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
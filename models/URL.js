const mongoose = require('mongoose')
const Schema = mongoose.Schema

const URLSchema = new Schema({
    OriginalURL: {
        type: String,
        required: true
    },
    ShortenURL: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('URL', URLSchema)
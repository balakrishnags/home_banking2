const mongoose = require('mongoose')

module.exports = mongoose.model('Users', {
    name: { type: String, required: true, },
    email: { type: String, required: true },
    password: { type: String, required: true }
})
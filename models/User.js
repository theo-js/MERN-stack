const mongoose = require('mongoose')
const { Schema } = mongoose
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    photoURL: String,
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    emailVerified:  {
        type: Boolean,
        required: true
    },
    registrationDate: {
        type: Number,
        required: true
    },
    lastConnectionDate: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User
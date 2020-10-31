const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const hideLetters = require('../../utils/functions/hideLetters')
const config = require('../../config/keys')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// GET ALL USER ACCOUNTS
router.get('/', (req, res) => {
    User.find()
        .select('-password')
        .sort({ lastConnectionDate: -1 })
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ success: false, error: err.message }))
})


// GET SPECIFIC USER ACCOUNT
/*router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params
        const user = await getUserByID(uid).exec()
        if (user === null) res.status(404).json({ success: false, error: 'Error: User does not exist' })
        res.json(user)
    } catch (err) {
        err => res.status(404).json({ success: false, error: err.message })
    }
})*/

// REGISTER USER
router.post('/register', async (req, res) => {
    try {
        const { username, email, age, password, confirmation } = req.body
        // Simple validation
        if (!username || !email || !password || !confirmation ) throw new Error('Error: Please enter all fields')
        if (password !== confirmation) return res.status(404).json({ success: false, error: 'Confirmation does\'t match password'})
        if (password.length < 8) return res.status(404).json({ success: false, error: 'Password must have more than 8 characters'})
        if (username.length > 20 || email.length > 50 || password.length > 100) return res.status(404).json({ success: false, error: 'One field is too long'})
        if (!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
            throw new Error('Error: Email is invalid')
        }

        // Check if email is in db
        const emailExists = await User.findOne({ email }).exec()
        if (emailExists) throw new Error('This user already exists')

        // Create salt and hash
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Add new user
        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email,
            emailVerified: false,
            photoURL: '',
            age: age,
            registrationDate: Date.now(),
            lastConnectionDate: Date.now()
        })
        newUser.save()
            .then(user => {

                jwt.sign(
                    { id: user.id },
                    config.jwtSecret,
                    { expiresIn: 900 },
                    (err, token) => {
                        if (err) throw err;
     
                        res.json({
                            user: {
                                _id: user._id,
                                password: hideLetters(1, password),
                                username, email, token
                            },
                            success: true
                        })
                    }
                )
            })
    } catch (err) {
        res.status(404).json({ user: null, success: false, error: err.message })
    }
})

// DELETE USER ACCOUNT
router.delete('/:uid', auth, async (req, res) => {
    try {
        const { uid } = req.params
        // Check if target account is user's
        if (!req.user || uid !== req.user.id) return res.status(401).json({ success: false, error: 'You are not authenticated or do not have permission to delete this user' })

        const user = await getUserByID(uid)
        if (!user) throw new Error('Error: the user you are trying to delete does not exist')
        user.remove()
            .then(() => res.json({ success: true }))
    } catch (err) {
        res.status(404).json({ success: false, error: err.message })
    }
})

async function getUserByID (id) {
    const user = await User.findById(id).exec()
    return user
}

module.exports = router
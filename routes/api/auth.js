const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const hideLetters = require('../../utils/functions/hideLetters')
const config = require('../../config/keys')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// LOG USER IN
router.post('/', (req, res) => {
    const { email, password } = req.body

    // Simple validation
    if (!email || !password) return res.status(404).json({ success: false, error: 'Error: Please enter all fields'})
    if (!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
        return res.status(404).json({ success: false, error: 'Error: Email is invalid'})   
    }

    // Check if user exists
    User
    .findOne({ email })
    .exec()
    .then(async user => {
        if (user === null) return res.status(404).json({ success: false, error: 'Error: This user does not exist' })

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(401).json({ success: false, error: 'Error: Wrong password' })

        // Sign jwt
        jwt.sign(
            { id: user.id },
            config.jwtSecret,
            { expiresIn: 900 },
            (err, token ) => {
                if (err) return res.status(401).json({ success: false, error: err.message })
                // Send token and current user without password
                user.password = null
                res.status(200).json({ success: true, token, user })
            }
        )
    })
    .catch(err => res.status(401).json({ success: false, error: err.message }))
})

// @route     GET api/auth/user
// @desc      Get user data
// @access    Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
})

router.get('/state', auth, (req, res) => {
    res.status(200).json({ isAuthenticated: true })
})

module.exports = router
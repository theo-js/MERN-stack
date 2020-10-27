const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../../models/User')

router.get('/', (req, res) => {
    User.find()
        .sort({ lastConnectionDate: -1 })
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ success: false, error: err.message }))
})

router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params
        const user = await getUserByID(uid)
        res.json(user)
    } catch (err) {
        err => res.status(404).json({ success: false, error: err.message })
    }
})

router.post('/signup', async (req, res) => {
    try {
        // Check if email is in db
        const emailExists = await User.findOne({ email: req.body.email }).exec()
        if (emailExists) throw new Error('This email address is already registered')

        // Add new user
        const newUser = new User({
            username: req.body.username,
            photoURL: '',
            age: req.body.age,
            email: req.body.email,
            emailVerified: false,
            registrationDate: Date.now(),
            lastConnectionDate: Date.now()
        })
        newUser.save()
            .then(user => res.json({
                user: user,
                success: true
            }))
    } catch (err) {
        res.status(404).json({ user: null, success: false, error: err.message })
    }
})

router.delete('/:uid', async (req, res) => {
    try {
        const { uid } = req.params
        user = await getUserByID(uid)
        if (!user) throw error
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
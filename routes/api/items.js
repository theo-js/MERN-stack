const express = require('express')
const router = express.Router()

// Item Model
const Item = require('../../models/Item')

// @route    GET api/items
// @desc     Get All Items
// @access   Public
router.get('/', (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items))
        .catch(err => res.status(404).json({ success: false, error: err }))
})

// @route     POST api/items
// @desc      Create an item
// @access    Public
router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        date: new Date(Date.now())
    })

    newItem.save().then(item => res.json(item))
})

// @route     DELETE api/items/:id
// @desc      Delete An Item
// @access    Public
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false, error: err }))
})

module.exports = router
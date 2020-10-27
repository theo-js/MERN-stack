const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

// Bodyparser middleware
app.use(express.json())

// CORS policy
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Acess-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next()
})

// DB config
const db = require('./config/keys').mongoURI

// Connect to Mongo
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// Use routes
const itemsRouter = require('./routes/api/items')
app.use('/api/items', itemsRouter)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
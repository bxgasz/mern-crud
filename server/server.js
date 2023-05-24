const express = require('express');
const mongoose = require('mongoose')

require('express-async-errors')
require('dotenv').config()
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connetDB = require('./config/dbConn')

console.log(process.env.NODE_ENV)

connetDB()

const PORT = process.env.PORT || 3500

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))

app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${req.syscall}\t${req.hostname}`, 'mongoErrLog.log')
})
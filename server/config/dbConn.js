const mongoose = require('mongoose');
mongoose.set('strictQuery', true)

const connetDB = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connetDB
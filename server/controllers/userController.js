const User = require('../models/User')
const Note = require('../models/Note')
const bcrypt = require('bcrypt');

const getAllUsers = async(req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(404).json({ message: 'No Users Found' })
    }
    res.json(users)
}

const createUsers = async(req, res) => {
    const { username, password, roles } = req.body

    if(!username || !password) {
        return res.status(404).json({ message: 'All the fields required!' })
    }

    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const hashPwd = await bcrypt.hash(password, 10)
    const userObject = (!Array.isArray(roles) || !roles.length) ? { username, "password": hashPwd } : { username, "password": hashPwd, roles }
    const user = await User.create(userObject)
    
    if (user) {
        res.status(201).json({ message: `New User ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data recived' })
    }
}

const updateUsers = async(req, res) => {
    const { id, username, roles, active, password } = req.body

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required!' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not Found' })
    }

    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username!' })   
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}

const deleteUsers = async(req, res) => {
    const { id } = req.body

    if(!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const note = await Note.findOne({user: id}).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result.id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    createUsers,
    updateUsers,
    deleteUsers
}
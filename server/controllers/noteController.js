const Note = require('../models/Note')
const User = require('../models/User')

const getAllNotes = async(req,res) => {
    const notes = await Note.find().select().lean()
    if (!notes?.length) {
        return res.status(404).json({ message: 'No Notes Found' })
    }

    const noteWithUser = await Promise.all(notes.map(async(note) => {
        const user = await User.findById(note.user).lean().exec()
        return {...note, username: user.username}
    }))
    res.json(noteWithUser)
}

const createNotes = async(req,res) => {
    const { user, title, text} = req.body
    console.log(user,title,text)

    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All the fields required!' })
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' })
    }

    const note = await Note.create({ user, title, text })

    if (note) {
        res.status(201).json({ message: `New Note ${title} created` })
    } else {
        res.status(400).json({ message: 'Invalid note data recived' })
    }
}

const updateNotes = async(req,res) => {
    const {id, user, title, text, completed} = req.body

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All the fields required!' })
    }

    const note = await Note.findById(id).exec()

    if(!note) {
        return res.status(400).json({ message: 'Note not Found' })

    }
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate title!' })   
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({ message: `${updatedNote.title} updated` })
}

const deleteNotes = async(req,res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Note ID Required' })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()
    const reply = `Title ${result.title} with ID ${result.id} deleted`

    res.json(reply)
}

module.exports = {
    getAllNotes,
    createNotes,
    updateNotes,
    deleteNotes
}
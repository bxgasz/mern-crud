const express = require('express');
const router = express.Router()
const noteController = require('../controllers/noteController');
const verifyJwt = require('../middleware/verifyJwt');

router.use(verifyJwt)

router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNotes)
    .patch(noteController.updateNotes)
    .delete(noteController.deleteNotes)

module.exports = router
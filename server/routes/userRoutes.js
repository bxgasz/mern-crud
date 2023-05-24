const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJwt = require('../middleware/verifyJwt');

router.use(verifyJwt)

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUsers)
    .patch(userController.updateUsers)
    .delete(userController.deleteUsers)

module.exports = router
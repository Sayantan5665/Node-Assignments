const express = require('express');
const upload = require('../../helper/upload-image.helper');
const userController = require('../../controllers/api/auth/user.controller');
const emailVerifier = require('../../middleware/email-verifier.middleware');

const router = express.Router();

/* +=========== Login ===========+ */
router.post('/user/login', userController.loginUser);


/* +=========== Registration ===========+ */
router.post('/user/registration', emailVerifier.checkEmalil, upload.single('image'), userController.registerUser);
router.get('/confirmation/:email/:token', userController.confirmEmail);


module.exports = router;
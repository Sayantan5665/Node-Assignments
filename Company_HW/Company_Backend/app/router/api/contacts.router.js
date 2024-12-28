const express = require('express');
const contactInfoController = require('../../controllers/api/contacts/contact-info.controller');
const contactRequestController = require('../../controllers/api/contacts/contact-request.controller');

const router = express.Router();

/* +=========== Contact Info ===========+ */
router.get('/contact-info/fetch', contactInfoController.fetchContactInfo);


/* +=========== Contact Request ===========+ */
router.post('/contact-request/send', contactRequestController.createContactRequest);

module.exports = router;
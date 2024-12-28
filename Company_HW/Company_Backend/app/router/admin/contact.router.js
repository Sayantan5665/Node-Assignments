const express = require('express');
const authenticator = require('../../middleware/authenticator.middleware');
const contactInfoController = require('../../controllers/admin/contacts/contact-info.controller');
const contactRequestController = require('../../controllers/admin/contacts/contact-request.controller');

const router = express.Router();

/* +=========== Contact Info ===========+ */
router.get('/contacts/contact-info', authenticator.isLoggedin, contactInfoController.contactInfoPage);
router.post('/contacts/contact-info/change', contactInfoController.changeContactInfo);


/* +=========== Contact Request ===========+ */
router.get('/contacts/contact-requests', authenticator.isLoggedin, contactRequestController.contactRequestListPage);
router.delete('/contacts/contact-requests/delete/:id', contactRequestController.deleteContactRequest);


module.exports = router;
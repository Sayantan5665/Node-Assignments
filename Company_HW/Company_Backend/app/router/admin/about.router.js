const express = require('express');
const upload = require('../../helper/upload-image.helper');
const aboutUsController = require('../../controllers/admin/about-us/about.controller');
const ourTeamController = require('../../controllers/admin/about-us/our-team.controller');
const authenticator = require('../../middleware/authenticator.middleware');

const router = express.Router();


/* +=========== About us ===========+ */
router.get('/about-us/about', authenticator.isLoggedin, aboutUsController.aboutUsList);
router.get('/about-us/about/update/:id', authenticator.isLoggedin, aboutUsController.aboutUsUpdate);

router.post('/about-us/about/edit/:id', aboutUsController.editAboutUs);



/* +=========== Our Team ===========+ */
router.get('/about-us/our-team', authenticator.isLoggedin, ourTeamController.ourTeamList);
router.get('/about-us/our-team/update/:id', authenticator.isLoggedin, ourTeamController.ourTeamUpdate);

router.post('/about-us/our-team/edit/:id', ourTeamController.ourTeamEdit);


/* +=========== Team Member ===========+ */
router.get('/about-us/our-team/members/add', ourTeamController.teamMemberAdd);
router.get('/about-us/our-team/members/update/:id', ourTeamController.teamMemberUpdate);

router.post('/about-us/our-team/members/create', upload.single('image'), ourTeamController.teamMemberCreate);
router.post('/about-us/our-team/members/edit/:id', upload.single('image'), ourTeamController.teamMemberEdit);
router.get('/about-us/our-team/members/active-deactive/:id', ourTeamController.teamMemberActiveInactive);
router.delete('/about-us/our-team/members/delete/:id', ourTeamController.deleteTeamMember);

module.exports = router;
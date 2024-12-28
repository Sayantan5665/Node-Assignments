const express = require('express');
// const upload = require('../../helper/upload-image.helper');
const bannerController = require('../../controllers/api/home_content/banner.controller');
const serviceController = require('../../controllers/api/home_content/service.controller');
const testimonialController = require('../../controllers/api/home_content/testimonial.controller');

const router = express.Router();

/* +=========== Banner ===========+ */
router.get('/home/banner/fetch-all', bannerController.fetchAllbanner);


/* +=========== Provided Services ===========+ */
router.get('/home/service/fetch-all', serviceController.fetchAllService);
router.get('/home/service/fetch-single/:id', serviceController.fetchSingleService);


/* +=========== Testimonial ===========+ */
router.get('/home/testimony/fetch-all', testimonialController.getAllTestimonies)
// router.post('/home/testimony/create', upload.single('image'), testimonialController.addTestimony);
// router.post('/home/testimony/edit/:id', upload.single('image'), testimonialController.editTestimony);
// router.get('/home/testimony/active-deactive/:id', testimonialController.activeDeactivateTestimony);
// router.delete('/home/testimony/delete/:id', testimonialController.deleteTestimony);

module.exports = router;
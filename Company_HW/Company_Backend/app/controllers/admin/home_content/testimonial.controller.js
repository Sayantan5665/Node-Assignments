const { testimonialModel, testimonialValidator } = require('../../../models/home-content/testimonial.model');
const fs = require('fs');
const path = require('path');

class testimonialController {
    async testimonyListPage(req, res) {
        try {
            const testimonials = await testimonialModel.find();
            res.render('home_content/testimonial/list', {
                title: 'Testimonials',
                data: {
                    length: testimonials.length,
                    testimonials: testimonials,
                    url: req.url,
                    user: req.user
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.error(error);
            req.flash('message', ['Something went wrong', 'danger']);
            res.redirect('/');
        }
    }

    async addTestimonyPage(req, res) {
        try {
            res.render('home_content/testimonial/add', {
                title: 'Add Testimonial',
                data: {
                    url: req.url,
                    user: req.user
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.error(error);
            req.flash('message', ['Something went wrong', 'danger']);
            res.redirect('/home/testimonials');
        }
    }

    async editTestimonyPage(req, res) {
        try {
            const testimony = await testimonialModel.findById(req.params.id);
            res.render('home_content/testimonial/edit', {
                title: 'Add Testimonial',
                data: {
                    url: req.url,
                    testimony,
                    user: req.user
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.error(error);
            req.flash('message', ['Something went wrong', 'danger']);
            res.redirect('/home/testimonials');
        }
    }







    async addTestimony(req, res) {
        try {
            let baseUrl = `${req.protocol}://${req.get('host')}`;
            let imagePath = `${baseUrl}/assets/no-image.png`;
            const file = req.file;
            if (file) {
                imagePath = `${baseUrl}/uploads/${file.filename}`;
            }
            const body = req.body;
            body.image = imagePath;

            const { error } = testimonialValidator.validate(body);
            if (error) {
                console.log("error: ", error);
                req.flash('message', ['Validation failed!', 'warning'])
                return res.redirect('/home/testimony/add')
            }

            const data = new testimonialModel(body);

            await data.save();

            req.flash('message', ['Testimony added successfully!', 'success'])
            return res.redirect('/home/testimonials');
        } catch (error) {
            console.error(error);
            req.flash('message', ['Something went wrong', 'danger']);
            res.redirect('/home/testimonials');
        }
    }

    async editTestimony(req, res) {
        try {
            const id = req.params.id;

            const existingTestimony = await testimonialModel.findById(id);
            if (!existingTestimony) {
                req.flash('message', ['Testimony not found!', 'warning']);
                return res.redirect('/home/testimonials');
            }

            let baseUrl = `${req.protocol}://${req.get('host')}`;
            let imagePath = null;
            const file = req.file;
            if (file) {
                imagePath = `${baseUrl}/uploads/${file.filename}`;

                if (existingTestimony.image !== `${baseUrl}/assets/no-image.png`) {
                    const existingImage = existingTestimony.image.split('/').pop();
                    fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
                        if (err) console.error('Error deleting image: ', err);
                        else console.log('Old images deleted successfully');
                    });
                }
            }
            const body = {
                name: req.body.name || existingTestimony.name,
                image: imagePath || existingTestimony.image,
                designation: req.body.designation || existingTestimony.designation,
                content: req.body.content || existingTestimony.content,
                updated_at: Date.now()
            };

            const { error } = testimonialValidator.validate(body);
            if (error) {
                console.log("error: ", error);
                req.flash('message', ['Validation failed!', 'warning']);
                return res.redirect(`/home/testimonials/update/${id}`);
            }

            await testimonialModel.findByIdAndUpdate(id, body, { new: true });

            req.flash('message', ['Testimony updated successfully!', 'success']);
            return res.redirect('/home/testimonials');
        } catch (error) {
            console.error(error);
            req.flash('message', ['Something went wrong', 'danger']);
            res.redirect('/home/testimonials');
        }
    }

    async activeDeactivateTestimony(req, res) {
        try {
            const id = req.params.id;

            const existingTestimony = await testimonialModel.findById(id);
            if (!existingTestimony) {
                req.flash('message', ['Testimony not found!', 'warning']);
                return res.redirect('/home/testimonials');
            }

            const updatedTestimony = await testimonialModel.findByIdAndUpdate(id, { isActive: !existingTestimony.isActive }, { new: true });

            req.flash('message', [`Testimony ${updatedTestimony.isActive ? 'actived' : 'deactivated'} successfully!`, 'success']);
            return res.redirect('/home/testimonials');
        } catch (error) {
            console.error(error);
            req.flash('message', ['Something went wrong', 'danger']);
            res.redirect('/home/testimonials');
        }
    }

    async deleteTestimony(req, res) {
        try {
            const id = req.params.id;
            const existingTestimony = await testimonialModel.findById(id);
            if (!existingTestimony) {
                req.flash('message', ['Testimony not found!', 'warning']);
                return res.redirect('/home/testimonials');
            }
            if (existingTestimony.image !== `${req.protocol}://${req.get('host')}/assets/no-image.png`) {
                const existingImage = existingTestimony.image.split('/').pop();
                fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
                    if (err) console.error('Error deleting image: ', err);
                    else console.log('Old images deleted successfully');
                });
            }
            await testimonialModel.findByIdAndDelete(id);
            req.flash('message', [`Testimony deleted successfully!`, 'success']);
            return res.redirect('/home/testimonials');

        } catch (error) {
            console.error(error);
            req.flash('message', ['Something went wrong', 'danger']);
            res.redirect('/home/testimonials');
        }
    }
}

module.exports = new testimonialController();
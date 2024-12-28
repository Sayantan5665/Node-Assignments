const { aboutUsHomeValidator, aboutUsHomeModel } = require('../../../models/about-us/about.model');

class aboutUsHomeController {
    async aboutUsList(req, res) {
        try {
            const aboutUs = await aboutUsHomeModel.find({}, { __v: 0 })
            res.render('about-us/about/view', {
                title: 'About Us',
                data: {
                    length: aboutUs?.length,
                    aboutUs: aboutUs[0],
                    url: req.url,
                    user: req.user
                }
            });
        } catch (error) {
            console.log("error: ", error);
            res.redirect('/');
        }
    }

    async aboutUsUpdate(req, res) {
        try {
            const id = req.params.id || req.body.id;
            const aboutUs = await aboutUsHomeModel.findById(id, { __v: 0 })
            res.render('about-us/about/edit', {
                title: 'About Us - edit',
                data: {
                    aboutUs,
                    url: req.url,
                    user: req.user
                }
            });
        } catch (error) {
            console.log("error: ", error);

        }
    }





    async editAboutUs(req, res) {
        try {
            const id = req.params.id || req.body.id;
            const existingAboutUs = await aboutUsHomeModel.findById(id);

            const data = {
                heading: req.body.heading,
                title: req.body.title,
                sub_title: req.body.sub_title,
                content: req.body.content,
                updated_at: new Date()
            }

            const { error } = aboutUsHomeValidator.validate(data);
            if (error) {
                console.log("Validation failed: ", error);
            } else {
                await aboutUsHomeModel.findByIdAndUpdate(id, data);
                // console.log("updated banner: ", data);
                res.redirect('/about-us/about');
            }
        } catch (error) {
            console.error("error while editing banner: ", error);
        }
    }
}

module.exports = new aboutUsHomeController();
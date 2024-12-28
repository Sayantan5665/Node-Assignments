const { testimonialModel, testimonialValidator } = require('../../../models/home-content/testimonial.model');
const fs = require('fs');
const path = require('path');

class testimonialController {
    // async addTestimony(req, res) {
    //     try {
    //         let baseUrl = `${req.protocol}://${req.get('host')}`;
    //         let imagePath = `${baseUrl}/assets/no-image.png`;
    //         const file = req.file;
    //         if (file) {
    //             imagePath = `${baseUrl}/uploads/${file.filename}`;
    //         }
    //         const body = req.body;
    //         body.image = imagePath;

    //         const { error } = testimonialValidator.validate(body);
    //         if (error) {
    //             console.log("error: ", error);
    //             return res.status(400).json({
    //                 status: 400,
    //                 message: error.details[0].message
    //             });
    //         }

    //         const data = new testimonialModel(body);

    //         const newTestimonial = await data.save();

    //         return res.status(201).json({
    //             status: 201,
    //             message: 'Testimonial added successfully',
    //             data: newTestimonial
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({
    //             status: 500,
    //             message: "Some error occurred! ",
    //             error: error
    //         });
    //     }
    // }

    async getAllTestimonies(req, res) {
        try {
            const testimonies = await testimonialModel.find({ isActive: true }).select('-__v -isActive -created_at -updated_at');

            return res.status(200).json({
                status: 200,
                message: 'Testimonies fetched successfully',
                data: testimonies
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "Some error occurred! ",
                error: error
            });
        }
    }

    // async editTestimony(req, res) {
    //     try {
    //         const id = req.params.id;

    //         const existingTestimony = await testimonialModel.findById(id);
    //         if (!existingTestimony) {
    //             return res.status(404).json({
    //                 status: 404,
    //                 message: 'Testimony not found'
    //             });
    //         }

    //         let baseUrl = `${req.protocol}://${req.get('host')}`;
    //         let imagePath = null;
    //         const file = req.file;
    //         if (file) {
    //             imagePath = `${baseUrl}/uploads/${file.filename}`;

    //             if (existingTestimony.image !== `${baseUrl}/assets/no-image.png`) {
    //                 const existingImage = existingTestimony.image.split('/').pop();
    //                 fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
    //                     if (err) console.error('Error deleting image: ', err);
    //                     else console.log('Old images deleted successfully');
    //                 });
    //             }
    //         }
    //         const body = {
    //             name: req.body.name || existingTestimony.name,
    //             image: imagePath || existingTestimony.image,
    //             designation: req.body.designation || existingTestimony.designation,
    //             content: req.body.content || existingTestimony.content,
    //             updated_at: Date.now()
    //         };

    //         const { error } = testimonialValidator.validate(body);
    //         if (error) {
    //             console.log("error: ", error);
    //             return res.status(400).json({
    //                 status: 400,
    //                 message: error.details[0].message
    //             });
    //         }

    //         const updatedTestimonial = await testimonialModel.findByIdAndUpdate(id, body, { new: true });

    //         return res.status(200).json({
    //             status: 200,
    //             message: 'Testimonial updated successfully',
    //             data: updatedTestimonial
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({
    //             status: 500,
    //             message: "Some error occurred! ",
    //             error: error
    //         });
    //     }
    // }

    // async deleteTestimony(req, res) {
    //     try {
    //         const id = req.params.id;
    //         const existingTestimony = await testimonialModel.findById(id);
    //         if (!existingTestimony) {
    //             return res.status(404).json({
    //                 status: 404,
    //                 message: 'Testimony not found'
    //             });
    //         }
    //         if (existingTestimony.image !== `${req.protocol}://${req.get('host')}/assets/no-image.png`) {
    //             const existingImage = existingTestimony.image.split('/').pop();
    //             fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
    //                 if (err) console.error('Error deleting image: ', err);
    //                 else console.log('Old images deleted successfully');
    //             });
    //         }
    //         await testimonialModel.findByIdAndDelete(id);
    //         return res.status(200).json({
    //             status: 200,
    //             message: 'Testimonial deleted successfully'
    //         });

    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({
    //             status: 500,
    //             message: "Some error occurred! ",
    //             error: error
    //         });
    //     }
    // }
}

module.exports = new testimonialController();
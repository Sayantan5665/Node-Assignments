const { serviceModel, serviceValidator } = require('../../../models/home-content/services.model');
const fs = require('fs');
const path = require('path');

class servicesController {
    async serviceList(req, res) {
        try {
            const services = await serviceModel.find({}, { __v: 0 })
            // console.log("req.url: ", req.url);
            res.render('home_content/provided-service/list', {
                title: 'Services',
                data: {
                    length: services?.length,
                    serviceList: services,
                    url: req.url,
                    user: req.user
                }
            })
        } catch (error) {
            console.error("error: ", error);
        }
    }

    async serviceAdd(req, res) {
        try {
            res.render('home_content/provided-service/add', {
                title: 'Services',
                data: {
                    url: req.url,
                    user: req.user
                }
            })
        } catch (error) {
            console.error("error: ", error);
        }
    }

    async serviceUpdate(req, res) {
        try {
            const id = req.params.id || req.body.id
            const service = await serviceModel.findOne({ _id: id, isActive: true }, { __v: 0 });
            if (service) {
                res.render('home_content/provided-service/edit', {
                    title: 'Services',
                    data: {
                        service,
                        url: req.url,
                        user: req.user
                    }
                })
            } else {
                console.log('couldn\'t find the service or it is deactive.');
                res.redirect('/home/service');
            }
        } catch (error) {
            console.error("error: ", error);
        }
    }





    async createService(req, res) {
        try {
            const file = req.file;
            let imagePath = "";
            if (file) {
                imagePath = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            } else {
                imagePath = `${req.protocol}://${req.get('host')}/assets/no-image.png`;
            }

            const body = {
                image: imagePath,
                hover_color: req.body.hover_color,
                heading: req.body.heading,
                content: req.body.content
            }

            const { error, value } = serviceValidator.validate(body);

            if (error) {
                console.error("validation failed: ", error);
            } else {
                const service = await new serviceModel(value).save();

                res.redirect('/home/service');
            }

        } catch (error) {
            console.error("error while creating service: ", error);
        }
    }

    async editService(req, res) {
        try {
            const id = req.params.id;
            const basePath = `${req.protocol}://${req.get('host')}/uploads`;
            const file = req.file;
            let imagePath = "";

            const existingService = await serviceModel.findById(id);

            if (existingService) {
                if (file) {
                    imagePath = `${basePath}/${file.filename}`;

                    const existingImage = existingService.image.split('/').pop(); // Get the image file name;
                    if (existingImage && existingImage !== 'no-image.png') {
                        fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
                            if (err) console.error(`Error deleting image: ${err}`);
                            else console.log('Old images deleted successfully');
                        });
                    }
                } else imagePath = existingService?.image;

                const data = {
                    image: imagePath,
                    hover_color: req.body.hover_color || existingService.hover_color,
                    heading: req.body.heading || existingService.heading,
                    content: req.body.content || existingService.content,
                    updated_at: Date.now()
                }

                const { error } = serviceValidator.validate(data);
                if (error) {
                    console.log("Validation failed: ", error);
                } else {
                    await serviceModel.findByIdAndUpdate(id, data);
                    // console.log("updated service: ", data);
                    res.redirect('/home/service');
                }
            } else {
                res.redirect(`/home/service/update/${id}`);
            }
        } catch (error) {
            console.error("error while editing service: ", error);
        }
    }

    async activeDeactiveService(req, res) {
        try {
            const id = req.params.id || req.body.id;
            const existingService = await serviceModel.findById(id);
            const service = await serviceModel.findByIdAndUpdate(id, { isActive: !existingService.isActive });
            console.log("Active/Deactive service: ", service);
            res.redirect('/home/service');
        } catch (error) {
            console.error("error while editing service: ", error);
        }
    }

    async deleteService(req, res) {
        try {
            const id = req.params.id || req.body.id;
            const existingService = await serviceModel.findById(id);
            const existingImage = existingService.image.split('/').pop(); // Get the image file name;
            if (existingImage && existingImage !== 'no-image.png') {
                fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
                    if (err) console.error(`Error deleting image: ${err}`);
                    else {
                        console.log('Old images deleted successfully');
                    }
                });
            }
            await serviceModel.findByIdAndDelete(id);
            console.log("service deleted successfully!");
            res.redirect('/home/service');

        } catch (error) {
            console.error("error while editing service: ", error);
        }
    }
}

module.exports = new servicesController();
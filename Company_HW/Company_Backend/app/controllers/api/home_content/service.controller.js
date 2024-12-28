const { serviceModel, serviceValidator } = require('../../../models/home-content/services.model');
const fs = require('fs');
const path = require('path');

class servicesController {
    async fetchAllService(req, res) {
        try {
            const service = await serviceModel.find({ isActive: true }, { __v: 0 })

            if (service.length) {
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully fetched all service.',
                    data: service
                });
            } else {
                return res.status(301).json({
                    status: 302,
                    message: 'No service found',
                    data: []
                });
            }
        } catch (error) {
            console.error("error: ", error);
            return res.status(500).json({
                status: 500,
                message: 'Some error occured!',
                error: error
            })
        }
    }

    async fetchSingleService(req, res) {
        try {
            const id = req.params.id;
            const service = await serviceModel.findOne({ _id: id, isActive: true }, { __v: 0 });
            if (service) {
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully fetched the service.',
                    data: service
                });
            } else {
                return res.status(301).json({
                    status: 301,
                    message: 'No service found',
                    data: {}
                });
            }

        } catch (error) {
            console.error("error: ", error);
            return res.status(500).json({
                status: 500,
                message: 'Some error occured!',
                error: error
            })
        }
    }
}

module.exports = new servicesController();
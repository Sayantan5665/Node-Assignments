const { bannerValidator, bannerModel } = require('../../../models/home-content/banner.model');
const path = require('path');
const fs = require('fs');

class bannerController {

    async fetchAllbanner(req, res) {
        try {
            const banners = await bannerModel.find({ isActive: true }, { __v: 0 })

            if (banners.length) {
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully fetched all banners.',
                    data: banners
                });
            } else {
                return res.status(301).json({
                    status: 301,
                    message: 'No banner found',
                    data: []
                });
            }
        } catch (error) {
            console.error("error: ", error);
            return res.status(500).json({
                status: 500,
                message: 'Some error occured while fetching banners!',
                error: error
            })
        }
    }
}

module.exports = new bannerController();
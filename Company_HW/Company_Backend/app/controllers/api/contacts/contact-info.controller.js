const { contactInfoModel } = require('../../../models/contacts/contact-info.modal');

class ContactInfoController {
    async fetchContactInfo(req, res) {
        try {
            const contactInfo = await contactInfoModel.find().select('-__v');
            if (!contactInfo.length) {
                return res.status(404).json({
                    status: 404,
                    message: 'Contact info not found!'
                })
            }

            res.status(200).json({
                status: 200,
                message: 'Contact info fetched successfully!',
                data: contactInfo[0] || {}
            })
            
        } catch (error) {
            console.log("error: ", error);
            res.status(500).json({
                status: 500,
                message: 'Failed to fetch contact info!',
                error: error
            })
        }
    }
}

module.exports = new ContactInfoController();
const { contactRequestModel, contactRequestValidator } = require('../../../models/contacts/contact-request.modal');

class contactRequestController {

    async createContactRequest(req, res) {
        try {
            const { error, value } = contactRequestValidator.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation failed.",
                    error: error
                })
            }
            const data = new contactRequestModel(value);
            const newContactRequest = await data.save();
            res.status(200).json({
                status: 200,
                message: 'Thank you, we have received your message! Please wait, we will send reply to you soon.',
                data: newContactRequest
            })
        } catch (error) {
            console.log("error: ", error);
            res.status(500).json({
                status: 500,
                message: 'Something went wrong! Please try again later.',
                error: error
            })
        }
    }

}

module.exports = new contactRequestController();
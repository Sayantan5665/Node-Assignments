const { contactRequestModel } = require('../../../models/contacts/contact-request.modal');

class contactRequestController {

    async contactRequestListPage(req, res) {
        try {
            const contactRequests = await contactRequestModel.find().sort({ createdAt: -1 });
            res.render('contacts/contact-request', {
                title: 'Contact Requests',
                data: {
                    length: contactRequests.length,
                    contactRequests: contactRequests,
                    url: req.url,
                    user: req.user
                },
                messages: req.flash('message')
            });

        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            return res.redirect('/')
        }
    }


    async deleteContactRequest(req, res) {
        try {
            const id = req.params.id;
            const contactRequest = await contactRequestModel.findByIdAndDelete(id);
            if (!contactRequest) {
                req.flash('message', ['Contact request not found', 'warning']);
                return res.redirect('/contacts/contact-requests');
            }
            req.flash('message', ['Contact request deleted successfully', 'success']);
            return res.redirect('/contacts/contact-requests');
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', ['Something went wrong', 'danger']);
            return res.redirect('/contacts/contact-requests');
        }
    }

}

module.exports = new contactRequestController();
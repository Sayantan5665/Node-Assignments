const { contactInfoValidators, contactInfoModel } = require('../../../models/contacts/contact-info.modal');
const getCoordinates = require('../../../helper/geoCoding.helper');
// const { inspect } = require('node:util');

class ContactInfoController {
    async contactInfoPage(req, res) {
        try {
            const contactInfo = await contactInfoModel.find();
            res.render('contacts/contact-info', {
                title: 'Contact Info',
                data: {
                    contactInfo: contactInfo[0] || {},
                    url: req.url,
                    user: req.user
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.error("Error while fetching contact info: ", error);
            req.flash('message', ['Failed to fetch contact info!', 'error']);
            return res.redirect('/');
        }
    }

    /**
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async changeContactInfo(req, res) {
        try {
            
            // console.log(inspect(req.body, true, null, true));
            const existingContactInfo = await contactInfoModel.find();

            if (!existingContactInfo.length) {
                const body = req.body
                
                const latLng = await getCoordinates(body.address);
                body.lat = latLng.lat;
                body.lng = latLng.lng;
                
                const { error } = contactInfoValidators.validate(body);
                if (error) {
                    console.error("Validation failed: ", error);
                    req.flash('message', [`Validation failed!`, 'warning']);
                    return res.redirect('/contacts/contact-info');
                }
                
                console.log("body 1: ", body);
                await contactInfoModel.create(body);
                req.flash('message', [`Contact info created successfully!`, 'success']);
                return res.redirect('/contacts/contact-info');

            } else {
                const body = {
                    address: req.body.address || existingContactInfo[0].address,
                    emails: req.body.emails || existingContactInfo[0].emails,
                    phones: req.body.phones || existingContactInfo[0].phones,
                }

                if (req.body.address) {
                    const latLng = await getCoordinates(body.address);
                    body.lat = latLng.lat;
                    body.lng = latLng.lng;
                } else {
                    body.lat = existingContactInfo[0].lat;
                    body.lng = existingContactInfo[0].lng;
                }
                console.log("body 2: ", body);

                const { error } = contactInfoValidators.validate(body);
                if (error) {
                    console.error("Validation failed: ", error);
                    req.flash('message', [`Validation failed!`, 'warning']);
                    return res.redirect('/contacts/contact-info');
                }

                await contactInfoModel.findByIdAndUpdate(existingContactInfo[0]._id, body);

                req.flash('message', [`Contact info updated successfully!`, 'success']);
                return res.redirect('/contacts/contact-info');
            }

        } catch (error) {
            console.error("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            return res.redirect('/contacts/contact-info');
        }
    }
}

module.exports = new ContactInfoController();
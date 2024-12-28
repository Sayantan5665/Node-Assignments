const userModel = require("../models/auth/user.model");

exports.checkEmalil = (req, res, next) => {
    userModel.findOne({ email: req.body.email }).then(data => {
        if (data) {
            req.flash('message', [`Email already exists!`, 'warning']);
            return res.redirect('/register')
        }
        // const { name, email, password, cpassword } = req.body;
        // if (!(name && email && password && cpassword)) {
        //     req.flash('message', [`All inputs are required!`, 'warning']);
        //     return res.redirect('/register');
        // }

        // if (password !== cpassword) {
        //     req.flash('message', [`Incorrect password!`, 'warning']);
        //     return res.redirect('/register');
        // }

        next()
    }).catch(err => {
        console.log(err);
        next();
    })
}
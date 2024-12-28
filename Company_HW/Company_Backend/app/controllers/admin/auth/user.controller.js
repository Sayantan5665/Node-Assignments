const { userModel, userValidator } = require('../../../models/auth/user.model');
const tokenModel = require('../../../models/auth/token.model');
const { hashPassword, verifyPasswords, tokenGenerator, transporter, sendEmailVerificationLink } = require('../../../helper/auth.helper');
const crypto = require("crypto");

class UserController {
    async registration(req, res) {
        try {
            res.render('auth/registration', {
                title: 'Registration',
                data: {
                    url: req.url
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [error.message, 'danger'])
            res.redirect('/login');
        }
    }
    async login(req, res) {
        try {
            res.render('auth/login', {
                title: 'Login',
                data: {
                    url: req.url
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [error.message, 'danger'])
            res.redirect('/registration');
        }
    }






    async registerUser(req, res) {
        try {
            if (!(req.body.password === req.body.confirmPassword)) {
                req.flash('message', ['Passwords do not match', 'warning']);
                return res.redirect('/registration');
            }

            let user = await userModel.findOne({ email: req.body.email.toLowerCase() });
            if (user) {
                req.flash('message', [`Email already exists!`, 'warning']);
                return res.redirect('/registration');
            }

            const body = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                name: req.body.first_name + " " + req.body.last_name,
                email: req.body.email.toLowerCase(),
                hint: {
                    question: req.body.hint.question,
                    answer: req.body.hint.answer,
                }
            }

            const hashedPassword = await hashPassword(req.body.password);
            body.password = hashedPassword;

            const file = req.file;
            const basePath = `${req.protocol}://${req.get('host')}`;
            let imagePath = `${basePath}/assets/no-image.png`;
            if (file) {
                imagePath = `${basePath}/uploads/${file.filename}`;
            }
            body.image = imagePath;

            console.log("body: ", body);
            const { errors, value } = userValidator.validate(body);

            if (errors) {
                console.log("Validation failed: ", errors);
                req.flash('message', ['Invalid input', 'warning']);
                return res.redirect('/registration');
            }

            /** First save the user details */
            user = await new userModel(value).save();
            console.log("Created user: ", user);

            /** Now generate and save the token for mail verification */
            const token = await new tokenModel({
                user: user._id,
                token: crypto.randomBytes(16).toString('hex'),
            }).save();

            let verification_mail = `http://${req.headers.host}/confirmation/${user.email}/${token.token}`;

            /** Now send the verification mail*/
            let mailOptions = {
                from: 'no-reply@sayantan.com',
                to: user.email,
                subject: 'Account Verification',
                html: `
                    <h1>Hello, ${body.name}</h1>
                    <p>Please verify your account by clicking the link below:</p>
                    <a href="${verification_mail}" style="color: blue;">${verification_mail}</a>
                    <p>Thank you!</p>
                `
            };
            await sendEmailVerificationLink(req, res, mailOptions);


            req.flash('message', [`Registration successful! ${body.name}, please check your email for verification.`, 'success']);
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            req.flash('message', [error.message, 'danger'])
            res.redirect('/registration');
        }
    }

    async confirmEmail(req, res) {
        try {
            const _token = req.params.token;
            const _mail = req.params.email;

            const token = await tokenModel.findOne({ token: _token });
            if (!token) {
                req.flash('message', ['Invalid or expired token', 'warning']);
                return res.redirect('/login');
            }

            const user = await userModel.findById(token.user);
            console.log("user: ", user);
            if (!user) {
                req.flash('message', ['User not found', 'warning']);
                return res.redirect('/login');
            }

            if (user.isVerified) {
                req.flash('message', ['Email already verified', 'warning']);
                return res.redirect('/login');
            }

            const verifiedUser = await userModel.findOneAndUpdate(
                { email: _mail },
                { $set: { isVerified: true, isActive: true } },
                { new: true }
            );

            req.flash('message', [`Successfully verified! ${verifiedUser?.name}, You can log in now.`, 'success']);
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            req.flash('message', [error.message, 'danger'])
            res.redirect('/login');
        }
    }


    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email: email, isActive: true });

            if (!user) {
                req.flash('message', ['User not found', 'warning']);
                return res.redirect('/login');
            }

            if (!user.isVerified) {
                req.flash('message', ['Email not verified yet', 'warning']);
                return res.redirect('/login');
            }

            if (verifyPasswords(password, user.password)) {
                const token = await tokenGenerator({
                    name: user.name,
                    email: user.email,
                    user_id: user._id,
                    role: user.role,
                    image: user.image
                });
                // res.cookie('auth-token', token, { expires: new Date(Date.now() + 60 * 60 * 1000) });
                res.cookie('auth-token', token, {
                    httpOnly: true,  // prevents JavaScript from accessing the cookie
                    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
                });
                req.flash('message', [`Logged in successfully! ${user.name}`, 'success']);
                res.redirect('/');
            }


        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [error.message, 'danger']);
            res.redirect('/login');
        }
    }

    async logoutUser(req, res) {
        try {
            // Clear the JWT token cookie by setting its maxAge to 0
            res.cookie('auth-token', '', {
                httpOnly: true,
                expires: new Date(0), // set to an expired date to remove the cookie
            });
            res.redirect('/login');
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [error.message, 'danger']);
            res.redirect('/');
        }
    };
}

module.exports = new UserController();
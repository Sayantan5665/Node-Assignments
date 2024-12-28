const { teamMemberValidator, ourTeamValidator, teamMemberModel, ourTeamModel } = require('../../../models/about-us/our-team.model');
const fs = require('fs');
const path = require('path');
class ourTeamController {
    /**
     * Our Team
     */
    async ourTeamList(req, res) {
        try {
            let ourTeam = await ourTeamModel.find({ __v: 0 }).populate('teamMembers');
            ourTeam = ourTeam[0];

            const memberList = await teamMemberModel.find({ __v: 0 });
            res.render('about-us/our-team/view', {
                title: 'Our Team',
                data: {
                    length: ourTeam?.length,
                    ourTeam: ourTeam,
                    memberList,
                    url: req.url,
                    user: req.user
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect('/');
        }
    }

    async ourTeamUpdate(req, res) {
        try {
            const id = req.params.id || req.body.id;

            let ourTeam = await ourTeamModel.find({ __v: 0 }).populate('teamMembers');
            ourTeam = ourTeam[0];
            res.render('about-us/our-team/edit', {
                title: 'Our Team',
                data: {
                    length: ourTeam?.length,
                    ourTeam: ourTeam,
                    url: req.url,
                    user: req.user
                },
                messages: req.flash('message')
            });
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect('/about-us/our-team');
        }
    }

    async ourTeamEdit(req, res) {
        try {
            const id = req.params.id || res.body.id;
            // console.log("id: ", id, req.body);
            const { error, value } = ourTeamValidator.validate(req.body);
            if (error) {
                console.log("Validation failed: ", error);
                req.flash('message', [`Validation failed!`, 'warning']);
                res.redirect(`/about-us/our-team/update/${id}`);
            } else {
                await ourTeamModel.findByIdAndUpdate(id, { ...value, updated_at: Date.now() });
                req.flash('message', [`Team data updated successfully!`, 'success']);
                res.redirect('/about-us/our-team');
            }
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect('/about-us/our-team');
        }
    }



    /**
     * TEAM MEMBERS
    */
    async teamMemberAdd(req, res) {
        try {
            res.render('about-us/our-team/team-member/add', {
                title: 'Team Member - Add',
                data: {
                    url: req.url,
                    user: req.user
                }
            });
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect('/about-us/our-team');
        }
    }
    
    async teamMemberUpdate(req, res) {
        try {
            const id = req.params.id;
            const member = await teamMemberModel.findById(id);
            res.render('about-us/our-team/team-member/edit', {
                title: 'Team Member - Edit',
                data: {
                    url: req.url,
                    member,
                    user: req.user
                }
            });
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect('/about-us/our-team');
        }
    }

    async teamMemberCreate(req, res) {
        try {
            const file = req.file;
            const basePath = `${req.protocol}://${req.get('host')}`;
            let imagePath = `${basePath}/assets/no-image.png`;

            if (file) {
                imagePath = `${basePath}/uploads/${file.filename}`
            }

            const body = {
                image: imagePath,
                name: req.body.name,
                designation: req.body.designation,
                twitter_link: req.body.twitter_link,
                facebook_link: req.body.facebook_link,
                instagram_link: req.body.instagram_link,
                linkedin_link: req.body.linkedin_link
            }

            const { error, value } = teamMemberValidator.validate(body);

            if (error) {
                req.flash('message', [`Validation failed!`, 'warning']);
                res.redirect(`/about-us/our-team`);
            }
            else {
                const data = await new teamMemberModel(value).save();
                req.flash('message', [`New team member added successfully!`, 'success']);
                res.redirect(`/about-us/our-team`);
            }

        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect(`/about-us/our-team`);
        }
    }

    async teamMemberEdit(req, res) {
        try {
            const id = req.params.id;
            let imagePath = undefined;

            const existingMember = await teamMemberModel.findById(id);
            if (!existingMember) return res.status(400).json({ message: 'Member not found!' });

            const file = req.file;

            if (file) {
                const existingImage = existingMember.image.split('/').pop();
                if (existingImage && existingImage !== 'no-image.png') {
                    fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (error) => {
                        if (error) console.error(`Error deleting image: ${err}`);
                        else console.log('Old images deleted successfully');
                    })
                }

                imagePath = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }

            const body = {
                image: imagePath || existingMember.image,
                name: req.body.name || existingMember.name,
                designation: req.body.designation || existingMember.designation,
                twitter_link: req.body.twitter_link || existingMember.twitter_link,
                facebook_link: req.body.facebook_link || existingMember.facebook_link,
                instagram_link: req.body.instagram_link || existingMember.instagram_link,
                linkedin_link: req.body.linkedin_link || existingMember.linkedin_link,
                updated_at: Date.now(),
            }

            const { error, value } = await teamMemberValidator.validate(body);

            if (error) {
                req.flash('message', [`Validation failed!`, 'warning']);
                res.redirect(`/about-us/our-team/members/${id}`);
            }
            else {
                await teamMemberModel.findByIdAndUpdate(id, value);
                console.log("Update Team member data: ", value);
                req.flash('message', [`Member's data updated successfully!`, 'success']);
                res.redirect(`/about-us/our-team`);
            }

        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect(`/about-us/our-team`);
        }
    }

    async teamMemberActiveInactive(req, res) {
        try {
            const id = req.params.id;

            const existingMember = await teamMemberModel.findById(id);
            if (!existingMember) {
                req.flash('message', [`Member not found.`, 'warning']);
                res.redirect(`/about-us/our-team`);
            }

            // if active, id will be added to ourTeam's teamMember list
            let ourTeam = await ourTeamModel.find({}, { __v: 0 });
            ourTeam = ourTeam[0];
            if (ourTeam) {
                const teamId = ourTeam._id.toString();
                let _data;

                if (!existingMember.isActive) {
                    _data = {
                        description: ourTeam.description,
                        teamMembers: [...ourTeam.teamMembers, id]
                    }
                } else {
                    const _teamMembers = ourTeam.teamMembers;
                    const index = _teamMembers.findIndex((member) => member == id);
                    _teamMembers.splice(index, 1);

                    _data = {
                        description: ourTeam.description,
                        teamMembers: _teamMembers
                    }
                }

                await ourTeamModel.findByIdAndUpdate(teamId, _data);
            } else {
                req.flash('message', [`No team found!`, 'warning']);
                res.redirect(`/about-us/our-team`);
            }

            // change the status to active/inactive
            await teamMemberModel.findByIdAndUpdate(id, { isActive: !existingMember.isActive });
            req.flash('message', [`Successfully ${!existingMember.isActive ? 'activated' : 'deactivated'} the team member.`, 'success']);
            res.redirect(`/about-us/our-team`);

        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong!`, 'danger']);
            res.redirect(`/about-us/our-team`);
        }
    }

    async deleteTeamMember(req, res) {
        try {
            const id = req.params.id;

            const existingMember = await teamMemberModel.findById(id);
            const existingImage = existingMember.image.split('/').pop(); // Get the image file name;
            if (existingImage && existingImage !== 'no-image.png') {
                fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
                    if (err) console.error(`Error deleting image: ${err}`);
                    else {
                        console.log('Old images deleted successfully');
                    }
                });
            }

            await teamMemberModel.findByIdAndDelete(id);
            req.flash('message', [`Successfully deleted the member.`, 'success']);
            res.redirect(`/about-us/our-team`);
        } catch (error) {
            console.log("error: ", error);
            req.flash('message', [`Something went wrong.`, 'danger']);
            res.redirect(`/about-us/our-team`);
        }
    }
}

module.exports = new ourTeamController();
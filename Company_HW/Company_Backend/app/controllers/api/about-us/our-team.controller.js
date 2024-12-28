const { teamMemberValidator, ourTeamValidator, teamMemberModel, ourTeamModel } = require('../../../models/about-us/our-team.model');
const fs = require('fs');
const path = require('path');

class ourTeamController {
    async ourTeamList(req, res) {
        try {
            const ourTeam = await ourTeamModel.find({ __v: 0 }).populate('teamMembers').select('-__v');

            if (ourTeam) {
                return res.status(200).json({
                    status: 200,
                    message: "Our team is successfully fetched",
                    data: ourTeam[0]
                })
            } else return res.status(200).json({ message: "Nothing found" });

        } catch (error) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: 'Some error occured while fetching our team!',
                error: error
            });
        }
    }

    // async ourTeamCreate(req, res) {
    //     try {
    //         const teams = await ourTeamModel.find();
    //         if (teams.length >= 1) {
    //             return res.status(400).json({
    //                 message: 'Only one Team Description can be there!'
    //             });
    //         }

    //         const { error, value } = ourTeamValidator.validate(req.body);
    //         if (error) {
    //             console.log("Validation failed: ", error);
    //             return res.status(400).json({
    //                 message: 'Validation failed!',
    //                 error
    //             });
    //         } else {
    //             const ourTeam = await new ourTeamModel(value).save();
    //             console.log("created our team: ", ourTeam);
    //             return res.status(200).json({
    //                 message: 'Our team added successfully.',
    //                 data: ourTeam
    //             })
    //         }
    //     } catch (error) {
    //         console.log("error: ", error);
    //         return res.status(500).json({
    //             message: 'Some error occured!',
    //             data: error
    //         })
    //     }
    // }

    // async ourTeamEdit(req, res) {
    //     try {
    //         const id = req.params.id || res.body.id;
    //         console.log("id: ", id);
    //         const { error, value } = ourTeamValidator.validate(req.body);
    //         if (error) {
    //             console.log("Validation failed: ", error);
    //             return res.status(400).json({
    //                 message: 'Validation failed!',
    //                 error
    //             });
    //         } else {
    //             await ourTeamModel.findByIdAndUpdate(id, { ...value, updated_at: Date.now() });
    //             console.log("created our team: ", value);
    //             return res.status(200).json({
    //                 message: 'Our team updated successfully.',
    //                 data: value
    //             })
    //         }
    //     } catch (error) {
    //         console.log("error: ", error);
    //         return res.status(500).json({
    //             message: 'Some error occured!',
    //             data: error
    //         })
    //     }
    // }



    // /**
    //  * TEAM MEMBERS
    // */
    // async teamMemberCreate(req, res) {
    //     try {
    //         const file = req.file;
    //         const basePath = `${req.protocol}://${req.get('host')}`;
    //         let imagePath = `${basePath}/assets/no-image.png`;

    //         if (file) {
    //             imagePath = `${basePath}/uploads/${file.filename}`
    //         }

    //         const body = {
    //             image: imagePath,
    //             name: req.body.name,
    //             designation: req.body.designation,
    //             twitter_link: req.body.twitter_link,
    //             facebook_link: req.body.facebook_link,
    //             instagram_link: req.body.instagram_link,
    //             linkedin_link: req.body.linkedin_link
    //         }

    //         const { error, value } = teamMemberValidator.validate(body);

    //         if (error) return res.status(400).json({ message: 'Validation failed!' });
    //         else {
    //             const data = await new teamMemberModel(value).save();

    //             console.log("New Team member: ", data);
    //             return res.status(200).json({
    //                 message: 'New Team member added successfully.',
    //                 data: data
    //             })
    //         }

    //     } catch (error) {
    //         console.log("error: ", error);
    //         return res.status(500).json({
    //             message: 'Some error occured!',
    //             data: error
    //         })
    //     }
    // }

    // async teamMemberEdit(req, res) {
    //     try {
    //         const id = req.params.id;
    //         let imagePath = undefined;

    //         const existingMember = await teamMemberModel.findById(id);
    //         if (!existingMember) return res.status(400).json({ message: 'Member not found!' });

    //         const file = req.file;

    //         if (file) {
    //             const existingImage = existingMember.image.split('/').pop();
    //             if (existingImage && existingImage !== 'no-image.png') {
    //                 fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (error) => {
    //                     if (error) console.error(`Error deleting image: ${err}`);
    //                     else console.log('Old images deleted successfully');
    //                 })
    //             }

    //             imagePath = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    //         }

    //         const body = {
    //             image: imagePath || existingMember.image,
    //             name: req.body.name || existingMember.name,
    //             designation: req.body.designation || existingMember.designation,
    //             twitter_link: req.body.twitter_link || existingMember.twitter_link,
    //             facebook_link: req.body.facebook_link || existingMember.facebook_link,
    //             instagram_link: req.body.instagram_link || existingMember.instagram_link,
    //             linkedin_link: req.body.linkedin_link || existingMember.linkedin_link,
    //             updated_at: Date.now(),
    //         }

    //         const { error, value } = await teamMemberValidator.validate(body);

    //         if (error) return res.status(400).json({ message: 'Validation failed!' });
    //         else {
    //             await teamMemberModel.findByIdAndUpdate(id, value);
    //             console.log("Update Team member data: ", value);
    //             return res.status(200).json({
    //                 message: 'Team member data updated successfully.',
    //                 data: value
    //             })
    //         }

    //     } catch (error) {
    //         console.log("error: ", error);
    //         return res.status(500).json({
    //             message: 'Some error occured!',
    //             data: error
    //         })
    //     }
    // }

    // async teamMemberActiveInactive(req, res) {
    //     try {
    //         const id = req.params.id;

    //         const existingMember = await teamMemberModel.findById(id);
    //         if (!existingMember) return res.status(400).json({ message: 'Member not found!' });

    //         // if active, id will be added to ourTeam's teamMember list
    //         let ourTeam = await ourTeamModel.find({}, { __v: 0 });
    //         ourTeam = ourTeam[0];
    //         if (ourTeam) {
    //             const teamId = ourTeam._id.toString();
    //             let _data;

    //             if(!existingMember.isActive) {
    //                 _data = {
    //                     description: ourTeam.description,
    //                     teamMembers: [...ourTeam.teamMembers, id]
    //                 }
    //             } else {
    //                 const _teamMembers = ourTeam.teamMembers;
    //                 const index = _teamMembers.findIndex((member) => member == id);
    //                 _teamMembers.splice(index, 1);

    //                 _data = {
    //                     description: ourTeam.description,
    //                     teamMembers: _teamMembers
    //                 }
    //             }

    //             await ourTeamModel.findByIdAndUpdate(teamId, _data);
    //         } else return res.status(200).json({ message: "NO team found" });

    //         // change the status to active/inactive
    //         await teamMemberModel.findByIdAndUpdate(id, { isActive: !existingMember.isActive });
    //         console.log(`Successfully ${!existingMember.isActive ? 'activated' : 'deactivated'} the team member.`);
    //         return res.status(200).json({
    //             message: `Successfully ${!existingMember.isActive ? 'activated' : 'deactivated'} the team member.`,
    //         })

    //     } catch (error) {
    //         console.log("error: ", error);
    //         return res.status(500).json({
    //             message: 'Some error occured!',
    //             data: error
    //         })
    //     }
    // }

    // async deleteTeamMember(req, res) {
    //     try {
    //         const id = req.params.id;

    //         const existingMember = await teamMemberModel.findById(id);
    //         const existingImage = existingMember.image.split('/').pop(); // Get the image file name;
    //         if (existingImage && existingImage !== 'no-image.png') {
    //             fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'uploads', existingImage), (err) => {
    //                 if (err) console.error(`Error deleting image: ${err}`);
    //                 else {
    //                     console.log('Old images deleted successfully');
    //                 }
    //             });
    //         }

    //         await teamMemberModel.findByIdAndDelete(id);
    //         return res.status(200).json({
    //             message: `Successfully deleted the team member.`,
    //         })
    //     } catch (error) {
    //         console.log("error: ", error);
    //         return res.status(500).json({
    //             message: 'Some error occured!',
    //             data: error
    //         })
    //     }
    // }
}

module.exports = new ourTeamController();
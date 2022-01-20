const Group = require('../../models/Group');
const User = require('../../models/User');

// Get all groups of a user
const allGroups = async (req, res) => {
    try {
        const groups = await Group.find({ 
            members: { $in: [req.params.userId] }
        })
        .sort({ updatedAt: -1 })
        res.status(200).send(groups);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

// Create a new group
const createGroup = async (req, res) => {
    try {
        const group = new Group({
            groupName: req.body.name,
            members: [req.body.users],
            groupAdmin: req.user
        });
        const newGroup = await group.save();
        res.status(200).send(newGroup);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    allGroups,
    createGroup
}
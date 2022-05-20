const Group = require('../../models/Group');
const User = require('../../models/User');

// Access a group chat
const accessGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).send({
                message: 'Group not found'
            });
        }
        res.send(group);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

// Get all groups of a user
const allGroups = async (req, res) => {
    try {
        const groups = await Group.find({ 
            members: { $elemMatch: { $eq: req.user.userId } }
        })
        .sort({ updatedAt: -1 })
        res.status(200).send(groups);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

// Create a new group chat
const createGroup = async (req, res) => {
    try {
        let users = req.body.members;
        users.push(req.user.userId);
        const group = new Group({
            groupName: req.body.name,
            members: users,
            groupAdmin: req.user.userId,
            groupAvatar: req.body.groupAvatar,
            isPersonal: req.body.isPersonal
        });
        const newGroup = await group.save();
        res.status(200).send(newGroup);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

// Add user to a group chat
const addToGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.groupId, {
            $addToSet: { members: req.body.userId }
        });
        if (!group) {
            return res.status(404).send({
                message: 'Group not found'
            });
        }
        group.save();
        res.status(200).send(group);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

// Rename a group chat
const renameGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).send({
                message: 'Group not found'
            });
        }
        group.groupName = req.body.name;
        const updatedGroup = await group.save();
        res.status(200).send(updatedGroup);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

// Delete a group chat
const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).send({
                message: 'Group not found'
            });
        }
        if(group.groupAdmin !== req.user.userId) {
            return res.status(401).send({
                message: 'You are not the group admin'
            });
        }
        await group.remove();
        res.status(200).send({
            message: 'Group deleted successfully'
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    accessGroup,
    allGroups,
    createGroup,
    addToGroup,
    renameGroup,
    deleteGroup
}
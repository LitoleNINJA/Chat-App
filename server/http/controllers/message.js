const Message = require('../../models/Message');
const User = require('../../models/User');
const Group = require('../../models/Group');

// Get all messages of a group
const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ groupId: req.params.groupId });
        res.json(messages);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

// Send a new message
const sendMessage = async (req, res) => {
    const message = {
        groupId: req.body.groupId,
        sender: req.user,
        text: req.body.text
    }
    try {
        const newMessage = await Message.create(message);
        await Group.findByIdAndUpdate(req.body.groupId, { $push: { messages: newMessage._id } });
        res.json(newMessage);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    allMessages,
    sendMessage
}
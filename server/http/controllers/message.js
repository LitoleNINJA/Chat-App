const Message = require('../../models/Message');
const User = require('../../models/User');
const Group = require('../../models/Group');

// Get all messages of a group
const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ groupId: req.params.groupId })
        .populate('userId', 'username')
        .populate('group');
        res.send(messages);
    }
    catch (err) {
        res.send(err);
    }
}

// Send a new message
const sendMessage = async (req, res) => {
    const message = new Message(req.body);
    message.save((err, message) => {
        if (err) {
            res.send(err);
        }
        res.json(message);
    });
}

module.exports = {
    allMessages,
    sendMessage
}
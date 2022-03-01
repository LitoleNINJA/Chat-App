const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    groupId: {
        type: String,
    },
    sender: {
        type: Object,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

module.exports = mongoose.model('Message', messageSchema);
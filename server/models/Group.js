const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    members: [{
        type: String,
        required: true
    }],
    messages: [{
        type: String,
    }],
    groupAdmin: {
        type: String,
        required: true
    },
    groupAvatar: {
        type: String,
        default: 'https://img.icons8.com/material/24/ffffff/user-male-circle--v1.png'
    },
    isPersonal: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Group', groupSchema);

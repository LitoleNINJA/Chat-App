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
}, {
    timestamps: true,
});

module.exports = mongoose.model('Group', groupSchema);

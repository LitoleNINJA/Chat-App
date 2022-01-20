const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    messages: {
        type: Array,
        required: true
    },
    groupAdmin: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Group', groupSchema);

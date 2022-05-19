const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_avatar: {
        type: String,
    }
} , {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
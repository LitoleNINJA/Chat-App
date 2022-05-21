const User = require('../../models/User');
const jwt = require('jsonwebtoken');    
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const usedEmail = await User.findOne({ email });
        if (usedEmail) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }
        const usedUsername = await User.findOne({ username });
        if (usedUsername) {
            return res.status(400).json({
                message: 'Username already exists'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }
        const token = jwt.sign({
            userId: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            user_avatar: user.user_avatar,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const google = async (req, res) => {
    try {
        const { tokenId } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            const password = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                username: payload.name,
                email: payload.email,
                password: hashedPassword,
                user_avatar: payload.picture,
            });
            await newUser.save();
            user = newUser;
        }
        const token = jwt.sign({
            userId: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            user_avatar: payload.picture,
            isAdmin: user.isAdmin,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const verify = async (req, res) => {
    try {
        const token = req.headers['auth-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            res.status(200).json({
                message: 'User verified successfully'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getUsers = async (req, res) => {
    try {
        const query = req.query.search ? {
            $or: [
                { username: { $regex: "^" + req.query.search, $options: 'i' } },
                { email: { $regex: "^" + req.query.search, $options: 'i' } }
            ]
        } : {};
        const users = await User.find(query).find({ $ne: { _id: req.user._id } });
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, user_avatar } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, {
            username: username,
            user_avatar: user_avatar
        }, { new: true });
        res.status(200).json({
            updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    register,
    login,
    google,
    verify,
    getUsers,
    getUser,
    updateUser
}
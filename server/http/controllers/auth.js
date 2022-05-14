const User = require('../../models/User');
const jwt = require('jsonwebtoken');    
const bcrypt = require('bcrypt');
require('dotenv').config();

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

module.exports = {
    register,
    login,
    verify,
    getUsers,
    getUser
}
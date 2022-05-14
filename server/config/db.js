const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const dbconnect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database');
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = dbconnect;
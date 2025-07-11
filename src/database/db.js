const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectToDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
       logger.info('Connected to MongoDB successfully');
        
    } catch (error) {
        logger.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
}

module.exports = { connectToDB };
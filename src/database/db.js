const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        
    } catch (error) {
        console.log(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
}

module.exports = { connectToDB };
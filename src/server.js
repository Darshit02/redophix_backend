require("dotenv").config();
const express = require("express");
const { connectToDB } = require("./database/db");
const { logger } = require("./utils/logger");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectToDB();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

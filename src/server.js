require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./database/db");
const { logger } = require("./utils/logger");
const authRoutes = require("./routes/auth-route");
const settingsRoutes = require("./routes/setting-route");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectToDB();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies/auth headers
}))

app.use('/api/auth', authRoutes)
app.use('/api/settings', settingsRoutes)


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// connect to database
mongoose
    .connect(process.env.DATABASE_CLOUD)
    .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
    .catch((error) => console.log(error));

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// app middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors()); it is used to tranfer requests between different domains all other domains are allowed

// this is used when we want to allow requests from certain origins and not all the origins
app.use(cors({ origin: process.env.CLIENT_URL }));

// middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT;

app.listen(port, () => console.log(`API is running on the port ${port}`));

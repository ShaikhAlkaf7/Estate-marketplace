const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const listingRoute = require("./routes/listingRoutes");
const app = express();

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

app.get("/", (req, res) => {
  res.send("hi");
});

// connecting to mongodb database
const connectoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.log(`erro while connecting to mongo:${error.message}`);
  }
};

app.listen(process.env.PORT, () => {
  console.log("server listening on port");
  connectoDb();
});

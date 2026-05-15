const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const router = require("./routes/authRoutes");

dotenv.config();

const app = express(); 

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));


app.use("/", router);

 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const mongoose = require("mongoose");
const http = require('http')
require("dotenv").config();
const morgan = require("morgan");
const routes = require("./src/routes/index.routes");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 3002;

//middleware
app.use(morgan("dev"));
app.use(cors({ origin: "https://pf-la-pilcha.vercel.app" }));
// app.use(cors({ origin: "http://localhost:3000" })); para utilizar en desarrollo
app.use(express.json());

//routes
app.use("/api/v1", routes);

const server = http.createServer(app)
//mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server listen on port ${port}`);
    });
    console.log("Connected to MongoDB Atlas")
  })
  .catch((error) => console.log(console.error(error)));

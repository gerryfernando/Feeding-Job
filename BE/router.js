const express = require("express");
const cors = require("cors");
const Controller = require("./controller");
// const AuthController = require("./authController");
// const authenticateJWT = require("./middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Give access to folder public
app.use(express.static("public"));

app.get("/ping", async (req, res) => {
  res.status(200).send("pong");
});
// app.post("/login", AuthController.login);
app.get("/scrap/:jobTag", Controller.getScrapJobs);
app.get("/download", Controller.downloadExcel);
//Jobs
app.get("/job", Controller.getJobs);
app.post("/job", Controller.createJobs);
app.put("/job/:id", Controller.editJobs);
app.delete("/job/:id", Controller.deleteJobs);

module.exports = app;

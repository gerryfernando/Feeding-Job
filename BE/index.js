const express = require("express");
const cors = require("cors");
const Controller = require("./controller");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Give access to folder public
app.use(express.static("public"));

app.get("/ping", async (req, res) => {
  res.status(200).send("pong");
});

app.get("/scrap/:jobTag", Controller.getScrapJobs);
app.get("/download", Controller.downloadExcel);
//Jobs
app.get("/job", Controller.getJobs);
app.post("/job", Controller.createJobs);
app.put("/job/:id", Controller.editJobs);
app.delete("/job/:id", Controller.deleteJobs);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,   and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

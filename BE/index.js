const app = require("./router");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,   and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

module.exports = server;

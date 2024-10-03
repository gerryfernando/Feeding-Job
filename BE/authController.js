const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const users = [
  {
    username: "john",
    password: "admin",
    role: "admin",
  },
  {
    username: "anna",
    password: "member",
    role: "member",
  },
];
class AuthController {
  static async login(req, res) {
    let response = {
      message: "",
      token: null,
    };
    const { username, password } = req.body;

    const user = users.find((u) => {
      return u.username === username && u.password === password;
    });

    if (user) {
      const accessToken = jwt.sign(
        { username: user.username, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20m" }
      );

      response.message = "Login success";
      response.token = accessToken || null;
      res.status(200).json(response);
    } else {
      response.message = "Username or password incorrect";
      res.status(500).send(response);
    }
  }
}

module.exports = AuthController;

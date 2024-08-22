const dotenv = require("dotenv");
dotenv.config();

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true,
  },
  debug: process.env.DB_DEBUG || false,
  pool: { min: 0, max: 10, propagateCreateError: false },
});

module.exports = knex;

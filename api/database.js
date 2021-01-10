const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "tiger",
  host: "localhost",
  port: 5433,
  database: "socialmedia",
});
(async function () {
  client.connect();
})();

module.exports = client;

const AuthenticationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authentications",
  version: "1.0.0",
  register: async (server, option) => {
    const authenticationsHandler = new AuthenticationHandler(option);
    server.route(routes(authenticationsHandler));
  },
};

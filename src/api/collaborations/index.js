const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "collaboration",
  version: "1.0.0",
  register: async (server, option) => {
    const collaborationsHandler = new CollaborationsHandler(option);
    server.route(routes(collaborationsHandler));
  },
};

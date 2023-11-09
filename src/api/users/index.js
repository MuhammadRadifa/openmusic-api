const UserHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "users",
  version: "1.0.0",
  register: async (server, option) => {
    const usersHandler = new UserHandler(option);
    server.route(routes(usersHandler));
  },
};

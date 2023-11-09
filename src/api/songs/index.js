const SongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "songs",
  version: "1.0.0",
  register: async (server, option) => {
    const songsHandler = new SongsHandler(option);
    server.route(routes(songsHandler));
  },
};

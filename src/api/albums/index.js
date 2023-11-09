const AlbumsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albums",
  version: "1.0.0",
  register: async (server, option) => {
    const albumsHandler = new AlbumsHandler(option);
    server.route(routes(albumsHandler));
  },
};

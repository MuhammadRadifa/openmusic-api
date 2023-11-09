const AlbumsService = require("./postgres/albumsService");
const SongsService = require("./postgres/songsService");
const UsersService = require("./postgres/usersService");
const AuthenticationsService = require("./postgres/authenticationService");
const PlaylistsService = require("./postgres/playlistsService");
const CollaborationsService = require("./postgres/collaborationService");

module.exports = {
  AlbumsService,
  SongsService,
  UsersService,
  AuthenticationsService,
  PlaylistsService,
  CollaborationsService,
};

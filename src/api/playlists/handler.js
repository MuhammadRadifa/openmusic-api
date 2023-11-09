const ClientError = require("../../exceptions/clientError");

class playlistHandler {
  constructor({ service, validator }) {
    this.service = service;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
    this.deleteSongFromPlaylistHandler =
      this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler =
      this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this.validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this.service.addPlaylist(credentialId, name);

    return h
      .response({
        status: "success",
        message: "Playlist berhasil ditambahkan",
        data: {
          playlistId,
        },
      })
      .code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const result = await this.service.getPlaylists(credentialId);

    return h
      .response({
        status: "success",
        data: {
          playlists: result,
        },
      })
      .code(200);
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this.service.verifyPlaylistOwner(playlistId, credentialId);
      await this.service.deletePlaylist(playlistId);

      return h
        .response({
          status: "success",
          message: "Playlist berhasil dihapus",
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      return response;
    }
  }

  async postSongToPlaylistHandler(request, h) {
    this.validator.validatePostSongToPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { playlistId } = request.params;

    await this.service.verifyPlaylistAccessCollaboration(
      playlistId,
      credentialId
    );
    await this.service.verifySongs(songId);
    await this.service.addSongToPlaylist(playlistId, songId);
    await this.service.addActivityPlaylist(
      playlistId,
      songId,
      credentialId,
      "add"
    );

    return h
      .response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      })
      .code(201);
  }

  async getPlaylistByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this.service.verifyPlaylistAccessCollaboration(
      playlistId,
      credentialId
    );
    const result = await this.service.getPlayListById(playlistId);

    return h
      .response({
        status: "success",
        data: {
          playlist: result,
        },
      })
      .code(200);
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this.validator.validateDeleteSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    await this.service.verifyPlaylistAccessCollaboration(
      playlistId,
      credentialId
    );
    await this.service.verifySongs(songId);
    await this.service.deleteSongFromPlaylist(songId);
    await this.service.addActivityPlaylist(
      playlistId,
      songId,
      credentialId,
      "delete"
    );

    return h
      .response({
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      })
      .code(200);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    const result = await this.service.getActivityPlaylist(
      playlistId,
      credentialId
    );

    return h
      .response({
        status: "success",
        data: result,
      })
      .code(200);
  }
}

module.exports = playlistHandler;

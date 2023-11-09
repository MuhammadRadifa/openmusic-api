const ClientError = require("../../exceptions/clientError");

class SongsHandler {
  constructor({ service, validator }) {
    this.service = service;
    this.validator = validator;
    this.postSongsHandler = this.postSongsHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongsByIdHandler = this.getSongsByIdHandler.bind(this);
    this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
    this.deleteSongsByIdHandler = this.deleteSongsByIdHandler.bind(this);
  }

  async postSongsHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);

      const songId = await this.service.addSongs(request.payload);

      return h
        .response({
          status: "success",
          data: {
            songId,
          },
        })
        .code(201);
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
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      return response;
    }
  }

  async getSongsHandler(request, h) {
    try {
      const songs = await this.service.getSongs(request.query);
      return h
        .response({
          status: "success",
          data: {
            songs,
          },
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
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      return response;
    }
  }

  async getSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this.service.getSongsById(id);
      return h
        .response({
          status: "success",
          data: {
            song,
          },
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

  async putSongsByIdHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const { id } = request.params;

      await this.service.updateSongs(id, request.payload);

      return h
        .response({
          status: "success",
          message: "Lagu berhasil diperbarui",
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

  async deleteSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteSongs(id);
      return h
        .response({
          status: "success",
          message: "Lagu berhasil dihapus",
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
}

module.exports = SongsHandler;

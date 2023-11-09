const ClientError = require("../../exceptions/clientError");

class AuthenticationHandler {
  constructor({ service, tokenManager, validator }) {
    this.authenticationService = service.authenticationsService;
    this.usersService = service.usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;

    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.putAuthHandler = this.putAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
  }

  async postAuthHandler(request, h) {
    try {
      this.validator.validatePostAuthenticationPayload(request.payload);

      const id = await this.usersService.verifyUserCredential(request.payload);

      const accessToken = this.tokenManager.generateAccessToken({ id });
      const refreshToken = this.tokenManager.generateRefreshToken({ id });

      await this.authenticationService.addRefreshToken(refreshToken);

      return h
        .response({
          status: "success",
          message: "Authentication berhasil ditambahkan",
          data: {
            accessToken,
            refreshToken,
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

  async putAuthHandler(request, h) {
    try {
      this.validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this.authenticationService.verifyRefreshToken(refreshToken);
      const { id } = this.tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this.tokenManager.generateAccessToken({ id });

      return h
        .response({
          status: "success",
          message: "Access Token berhasil diperbarui",
          data: {
            accessToken,
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

  async deleteAuthHandler(request, h) {
    try {
      this.validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this.authenticationService.verifyRefreshToken(refreshToken);
      await this.authenticationService.deleteRefreshToken(refreshToken);

      return h
        .response({
          status: "success",
          message: "Refresh token berhasil dihapus",
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
}

module.exports = AuthenticationHandler;

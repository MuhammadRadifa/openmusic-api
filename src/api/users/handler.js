const ClientError = require("../../exceptions/clientError");

class UserHandler {
  constructor({ service, validator }) {
    this.service = service;
    this.validator = validator;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this.validator.validateUserPayload(request.payload);

      const userId = await this.service.addUser(request.payload);

      return h
        .response({
          status: "success",
          message: "User berhasil ditambahkan",
          data: {
            userId,
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
}

module.exports = UserHandler;

class CollaborationsHandler {
  constructor({ service, validator }) {
    this.collaborationService = service.collaborationsService;
    this.playlistService = service.playlistsService;
    this.userService = service.usersService;
    this.validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this.validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this.userService.verifyUsersExist(userId);
    await this.playlistService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId =
      await this.collaborationService.addPlaylistCollaboration(
        playlistId,
        userId
      );

    return h
      .response({
        status: "success",
        message: "Kolaborasi berhasil ditambahkan",
        data: {
          collaborationId,
        },
      })
      .code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this.validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this.playlistService.verifyPlaylistOwner(playlistId, credentialId);

    await this.collaborationService.deletePlaylistCollaboration(
      playlistId,
      userId
    );

    return h
      .response({
        status: "success",
        message: "Kolaborasi berhasil dihapus",
      })
      .code(200);
  }
}

module.exports = CollaborationsHandler;

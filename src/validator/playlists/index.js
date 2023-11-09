const InvariantError = require("../../exceptions/invariantError");
const {
  postPlaylistPayloadSchema,
  postSongToPlaylistPayloadSchema,
  deleteSongFromPlaylistPayloadSchema,
} = require("./schema");

const playlistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = postPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongToPlaylistPayload: (payload) => {
    const validationResult = postSongToPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteSongPayload: (payload) => {
    const validationResult =
      deleteSongFromPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistValidator;

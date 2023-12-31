const InvariantError = require("../../exceptions/invariantError");
const { albumPayloadSchema } = require("./schema");

const albumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = albumValidator;

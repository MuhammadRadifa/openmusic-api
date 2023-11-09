const InvariantError = require("../../exceptions/invariantError");
const collaborationSchemaPayload = require("./schema");

const collaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = collaborationSchemaPayload.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = collaborationValidator;

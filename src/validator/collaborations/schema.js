const Joi = require("joi");

const collaborationSchemaPayload = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = collaborationSchemaPayload;

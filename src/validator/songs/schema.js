const joi = require("joi");

const songPayloadSchema = joi.object({
  title: joi.string().required(),
  year: joi.number().required(),
  performer: joi.string().required(),
  genre: joi.string().required(),
  duration: joi.number(),
  albumId: joi.string(),
});

module.exports = songPayloadSchema;

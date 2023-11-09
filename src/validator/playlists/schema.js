const joi = require("joi");

const postPlaylistPayloadSchema = joi.object({
  name: joi.string().required(),
});

const postSongToPlaylistPayloadSchema = joi.object({
  songId: joi.string().required(),
});

const deleteSongFromPlaylistPayloadSchema = joi.object({
  songId: joi.string().required(),
});

module.exports = {
  postPlaylistPayloadSchema,
  postSongToPlaylistPayloadSchema,
  deleteSongFromPlaylistPayloadSchema,
};

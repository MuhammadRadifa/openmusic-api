const playlistMap = ({ id, name, owner }) => ({
  id,
  name,
  username: owner,
});

module.exports = playlistMap;

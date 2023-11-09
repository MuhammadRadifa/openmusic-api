exports.up = (pgm) => {
  pgm.addConstraint(
    "songs",
    "fk_songs.album_id",
    "FOREIGN KEY(albumid) REFERENCES album(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("songs", "fk_songs.album_id");
};

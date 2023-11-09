exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(30)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlists",
    "fk_playlists.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlists");
};

exports.up = (pgm) => {
  pgm.createTable("album", {
    id: {
      type: "VARCHAR(16)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("notes");
};

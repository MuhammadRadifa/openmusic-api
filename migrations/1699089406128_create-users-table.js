exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR(30)",
      notNull: true,
    },
    password: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    fullname: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};

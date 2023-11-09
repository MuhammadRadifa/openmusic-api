const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/invariantError");
const NotFoundError = require("../../exceptions/notFoundError");
const songMap = require("../../utils/songsMap");

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSongs({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let text = "SELECT * FROM songs";
    const values = [];
    if (title || performer) {
      const operator = title && performer ? "AND" : "OR";
      text = `SELECT * FROM songs WHERE LOWER(title) LIKE $1 ${operator} LOWER(performer) LIKE $2`;
      values.push(`%${title}%`, `%${performer}%`);
    }

    const query = {
      text,
      values,
    };
    const result = await this.pool.query(query);
    return result.rows.map(songMap);
  }

  async getSongsById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id=$1",
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
    return result.rows[0];
  }

  async updateSongs(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, albumId=$6 WHERE id=$7 RETURNING id",
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal diperbarui");
    }
  }

  async deleteSongs(id) {
    const query = {
      text: "DELETE FROM songs WHERE id=$1 RETURNING id",
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal dihapus");
    }
  }
}

module.exports = SongsService;

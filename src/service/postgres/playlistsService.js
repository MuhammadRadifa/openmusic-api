const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/invariantError");
const NotFoundError = require("../../exceptions/notFoundError");
const AuthorizationError = require("../../exceptions/authorizationError");
const songMap = require("../../utils/songsMap");

class PlaylistService {
  constructor() {
    this.pool = new Pool();
  }

  async verifyPlaylistOwner(id, owner) {
    const playlist = await this.verifyPlaylists(id);

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda Tidak Berhak mengakses resource ini");
    }
  }

  async verifyPlaylists(playlistId) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyPlaylistAccessCollaboration(playlistId, owner) {
    const playlist = await this.verifyPlaylists(playlistId);

    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlist.id, owner],
    };

    const result = await this.pool.query(query);

    if (playlist.owner !== owner && !result.rows.length) {
      throw new AuthorizationError("Anda Tidak Berhak mengakses resource ini");
    }
  }

  async verifySongs(songId) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }

  async addPlaylist(owner, name) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists VALUES($1,$2,$3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: "SELECT playlists.id,playlists.name,users.username FROM playlists INNER JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id WHERE playlists.owner = $1 OR collaborations.user_id = $1",
      values: [owner],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Playlist gagal dihapus");
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsongs-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1,$2,$3)",
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
  }

  async getPlayListById(playlistId) {
    const getPlaylist = await this.pool.query({
      text: "SELECT playlists.id,playlists.name,users.username FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.id = $1",
      values: [playlistId],
    });

    const query = {
      text: "SELECT playlist_songs.id,songs.title,songs.performer FROM playlists LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id LEFT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlists.id = $1",
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    const songs = result.rows.map(songMap);

    return {
      ...getPlaylist.rows[0],
      songs,
    };
  }

  async deleteSongFromPlaylist(songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE  song_id = $1",
      values: [songId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal dihapus dari playlist");
    }
  }

  async addActivityPlaylist(playlistId, songId, userId, action) {
    const id = `playlist_act${nanoid(16)}`;
    const time = new Date();

    const query = {
      text: `INSERT INTO playlist_song_activities VALUES($1,$2,$3,$4,$5,$6)`,
      values: [id, playlistId, songId, userId, action, time],
    };

    await this.pool.query(query);
  }

  async getActivityPlaylist(playlistId, userId) {
    await this.verifyPlaylistOwner(playlistId, userId);

    const playlist = await this.pool.query({
      text: "SELECT playlists.id FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.id = $1",
      values: [playlistId],
    });

    const query = {
      text: "SELECT users.username,songs.title,playlist_song_activities.action,playlist_song_activities.time FROM playlist_song_activities INNER JOIN users ON playlist_song_activities.user_id=users.id INNER JOIN songs ON playlist_song_activities.song_id=songs.id WHERE playlist_id=$1",
      values: [playlistId],
    };

    const activities = await this.pool.query(query);

    return {
      playlistId: playlist.rows[0].id,
      activities: activities.rows,
    };
  }
}

module.exports = PlaylistService;

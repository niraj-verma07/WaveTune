import musicModel from "../models/music.model.js";
import storageService from "../services/storage.service.js";
import id3 from "node-id3";
import playlistModel from "../models/playlist.model.js";

export async function uploadSongController(req, res) {
  try {
    const musicFile = req.files["music"]?.[0];
    const coverImageFile = req.files["coverImage"]?.[0];

    if (!musicFile || !coverImageFile) {
      return res.status(400).json({
        message: "Music and cover image are required",
      });
    }

    const songBuffer = musicFile.buffer;

    const tags = id3.read(songBuffer);

    const title = req.body.title || tags.title;

    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile({
        buffer: songBuffer,
        filename: `${title}.mp3`,
        folder: "/Spotify-Sync/Songs",
      }),

      storageService.uploadFile({
        buffer: coverImageFile.buffer,
        filename: `${title}.jpeg`,
        folder: "/Spotify-Sync/CoverImages",
      }),
    ]);

    const song = await musicModel.create({
      title,
      artist: `${req.user.fullname.firstName} ${req.user.fullname.lastName}`,
      artistId: req.user._id,
      musicKey: songFile.url,
      coverImageKey: posterFile.url,
    });

    res.status(201).json({
      message: "Song uploaded successfully",
      song,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getArtistMusicController(req, res) {
  try {
    const musics = await musicModel
      .find({ artistId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Songs fetched successfully",
      musics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function createPlaylistController(req, res) {
  const { title, musics } = req.body;

  try {
    const playlist = await playlistModel.create({
      title,
      artistId: req.user.id,
      artist: `${req.user.fullname.firstName} ${req.user.fullname.lastName}`,
      musics,
    });

    return res.status(201).json({
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getPlaylistsController(req, res) {
  try {
    const playlists = await playlistModel.find({ artistId: req.user.id });

    return res.status(200).json({
      message: "Playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getAllMusicController(req, res) {
  const { skip = 0, limit = 20 } = req.query;

  try {
    const musicsDocs = await musicModel.find().skip(skip).limit(limit).lean();

    const musics = musicsDocs.map((music) => ({
      ...music,
      musicUrl: music.musicKey,
      coverImageUrl: music.coverImageKey,
    }));

    res.status(200).json({
      message: "Music fetched successfully",
      musics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getPlaylistByIdController(req, res) {
  const { id } = req.params;

  try {
    const playlistDocs = await playlistModel.findById(id).lean();

    if (!playlistDocs) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    const playlist = {
      ...playlistDocs,
    };

    res.status(200).json({
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getMusicByIdController(req, res) {
  const { id } = req.params;

  try {
    const music = await musicModel.findById(id).lean();

    if (!music) {
      return res.status(404).json({
        message: "Music not found",
      });
    }

    res.status(200).json({
      message: "Music fetched successfully",
      music,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getArtistPlaylistsController(req, res) {
  try {
    const playlists = await playlistModel.find({ artistId: req.user.id });
    return res.status(200).json({ playlists });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

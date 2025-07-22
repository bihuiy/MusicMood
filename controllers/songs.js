import express from "express";
import Song from "../models/song.js";
import isSignedIn from "../middleware/isSignedIn.js";
import Playlist from "../models/playlist.js";

const router = express.Router();

// index - display all songs, requires asynchronous database operations
router.get("/", async (req, res, next) => {
  try {
    const songs = await Song.find();
    return res.render("songs/index.ejs", {
      allSongs: songs,
    });
  } catch (error) {
    next(error);
  }
});

// show - display a specific song's details, requires asynchronous database querying
router.get("/:songId", isSignedIn, async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.songId);
    const playlists = await Playlist.find({ owner: req.session.user._id });
    //console.log(playlists);
    return res.render("songs/show.ejs", { song, playlists });
  } catch (error) {
    next(error);
  }
});

// add a song to the playlist
router.post("/:songId/add-to-playlist", isSignedIn, async (req, res, next) => {
  const { songId } = req.params;
  const { playlistId } = req.body;
  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    res.redirect(`/playlists/${playlistId}`);
  } catch (error) {
    next(error);
  }
});

// export the router
export default router;

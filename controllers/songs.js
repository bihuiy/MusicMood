import express from "express";
import Song from "../models/song.js";
import isSignedIn from "../middleware/isSignedIn.js";
import Playlist from "../models/playlist.js";
import Comment from "../models/comment.js";

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

// show - display a specific song's details (+comments), requires asynchronous database querying
router.get("/:songId", async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.songId);
    const playlists = req.session.user
      ? await Playlist.find({ owner: req.session.user._id })
      : [];
    //console.log(playlists);
    const comments = await Comment.find({ song: song._id }).populate("user");
    return res.render("songs/show.ejs", { song, playlists, comments });
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

// add a comment to a song
router.post("/:songId/add-comments", isSignedIn, async (req, res, next) => {
  try {
    const { content, mood } = req.body;
    const comment = await Comment.create({
      user: req.session.user._id,
      song: req.params.songId,
      content,
      mood,
    });
    await comment.save();
    return res.redirect(`/songs/${req.params.songId}`);
  } catch (error) {
    next(error);
  }
});

// delete a comment of a song
router.delete(
  "/:songId/remove-comments",
  isSignedIn,
  async (req, res, next) => {
    try {
      const { songId } = req.params;
      const { commentId } = req.body;
      const comment = await Comment.findById(commentId);
      if (comment.user.equals(req.session.user._id)) {
        await comment.deleteOne();
        return res.redirect(`/songs/${songId}`);
      } else {
        throw new Error("You don't have permission to do that");
      }
    } catch (error) {
      next(error);
    }
  }
);

// export the router
export default router;

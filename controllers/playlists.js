import express from "express";
import Playlist from "../models/playlist.js";
import isSignedIn from "../middleware/isSignedIn.js";
import { render } from "ejs";

const router = express.Router();

// new - show a form to add a new playlist, displays a static form page that doesn’t require data from the database
router.get("/new", isSignedIn, (req, res, next) => {
  try {
    return res.render("playlists/new.ejs");
  } catch (error) {
    next(error);
  }
});

// show - display a specific playlist's details, requires asynchronous database querying
router.get("/:playlistId", isSignedIn, async (req, res, next) => {
  try {
    const populatedPlaylist = await Playlist.findById(req.params.playlistId)
      .populate("owner")
      .populate("songs");
    return res.render("playlists/show.ejs", { playlist: populatedPlaylist });
  } catch (error) {
    next(error);
  }
});

// edit - show a form to edit an existing playlist's details
router.get("/:playlistId/edit", isSignedIn, async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    return res.render("playlists/edit.ejs", { playlist });
  } catch (error) {
    next(error);
  }
});

// update - update a specific playlist's details
router.put("/:playlistId", isSignedIn, async (req, res, next) => {
  try {
    const updatePlaylist = await Playlist.findById(req.params.playlistId);
    if (updatePlaylist.owner.equals(req.session.user._id)) {
      await updatePlaylist.updateOne(req.body);
      return res.redirect(`/playlists/${updatePlaylist._id}`);
    } else {
      return res.send("You don't have permission to do that");
    }
  } catch (error) {
    next(error);
  }
});

// create - add a new playlist to the profile, requires asynchronous database writing
router.post("/", isSignedIn, async (req, res, next) => {
  try {
    req.body.owner = req.session.user._id;
    const createdPlaylist = await Playlist.create(req.body);
    return res.redirect(`/playlists/${createdPlaylist._id}`);
  } catch (error) {
    next(error);
  }
});

// delete - remove a specific playlist
router.delete("/:playlistId", isSignedIn, async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (playlist.owner.equals(req.session.user._id)) {
      await playlist.deleteOne();
      return res.redirect(`/profile/${req.session.user._id}`);
    } else {
      throw new Error("You don't have permission to do that");
    }
  } catch (error) {
    next(error);
  }
});

// remove a song from the playlist
router.delete(
  "/:playlistId/remove-songId",
  isSignedIn,
  async (req, res, next) => {
    const { playlistId } = req.params;
    const { songId } = req.body;
    try {
      const playlist = await Playlist.findById(playlistId);
      if (playlist.owner.equals(req.session.user._id)) {
        playlist.songs = playlist.songs.filter((song) => {
          return song.toString() !== songId;
        });
        await playlist.save();
        res.redirect(`/playlists/${playlistId}`);
      } else {
        throw new Error("You don't have permission to do that");
      }
    } catch (error) {
      error.renderForm = true;
      next(error);
    }
  }
);

// export the router
export default router;

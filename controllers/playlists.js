import express from "express";
import Playlist from "../models/playlist.js";
import isSignedIn from "../middleware/isSignedIn.js";

const router = express.Router();

// index - display all playlists, requires asynchronous database operations
router.get("/", isSignedIn, async (req, res, next) => {
  try {
    const songs = await Playlist.find();
    return res.render("playlists/index.ejs", {
      allSongs: songs,
    });
  } catch (error) {
    next(error);
  }
});

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
    const playlist = await Playlist.findById(req.params.playlistId);
    return res.render("playlists/show.ejs", { playlist });
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
    const updatePlaylist = await Playlist.findByIdAndUpdate(
      req.params.playlistId,
      req.body
    );
    return res.redirect(`/playlists/${updatePlaylist._id}`);
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
    await Playlist.findByIdAndDelete(req.params.playlistId);
    return res.redirect("/playlists");
  } catch (error) {
    next(error);
  }
});

// export the router
export default router;

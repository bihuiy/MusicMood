import express from "express";
import Song from "../models/song.js";
import isSignedIn from "../middleware/isSignedIn.js";

const router = express.Router();

// index - display all songs, requires asynchronous database operations
router.get("/", isSignedIn, async (req, res, next) => {
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
    return res.render("songs/show.ejs", { song });
  } catch (error) {
    next(error);
  }
});

// export the router
export default router;

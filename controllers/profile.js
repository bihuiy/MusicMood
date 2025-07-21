import express from "express";
import isSignedIn from "../middleware/isSignedIn.js";
import Playlist from "../models/playlist.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/:userId", isSignedIn, async (req, res, next) => {
  try {
    const playlistOwnerId = req.params.userId;

    // all the playlists created by this userId
    const populatedPlaylists = await Playlist.find({
      owner: playlistOwnerId,
    }).populate("owner");

    // find this user by the userId
    const playlistOwner = await User.findById(playlistOwnerId);

    res.render("profile/profile.ejs", {
      playlists: populatedPlaylists,
      playlistOwner,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

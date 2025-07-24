import express from "express";
import isSignedIn from "../middleware/isSignedIn.js";
import Playlist from "../models/playlist.js";
import User from "../models/user.js";
import Comment from "../models/comment.js";

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

    // get the user's mood from the latest comment
    const lastComment = await Comment.findOne({ user: playlistOwnerId })
      .sort({ createdAt: -1 })
      .select("mood") //
      .exec();
    console.log("Last comment found:", lastComment);
    const mood = lastComment ? lastComment.mood : "None";

    let message;
    if (mood === "Happy") {
      message = "Keep enjoying your happy life!";
    } else if (mood === "Sad") {
      message = "Feeling down? We're here for you.";
    } else if (mood === "Nostalgic") {
      message = "Music brings memories to life!";
    } else if (mood === "Fun Fact") {
      message = "Thanks for sharing the fun insight!";
    } else if (mood === "Chill") {
      message = "Stay relaxed and vibe on.";
    } else if (mood === "Romantic") {
      message = "Love is in the air—and in the music.";
    } else if (mood === "Energetic") {
      message = "Your energy is contagious! Keep the beat going!";
    } else if (mood === "Lonely") {
      message = "Feeling alone? Music connects us all.";
    } else {
      message = "Share your mood through music!";
    }

    res.render("profile/profile.ejs", {
      playlists: populatedPlaylists,
      playlistOwner,
      mood,
      message,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

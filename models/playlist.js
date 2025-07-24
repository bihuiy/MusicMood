import mongoose from "mongoose";

// define a playlist schema
const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  playlistImage: { type: String },
});

// compile the schema into a model/function
const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;

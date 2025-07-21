import mongoose from "mongoose";

// define a song schema
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  releaseYear: String,
});

// compile the schema into a model/function
const Song = mongoose.model("Song", songSchema);

export default Song;

// 1. connect database
import mongoose from "mongoose";
import dotenv from "dotenv";
import Song from "../models/song.js";
dotenv.config();

// 2. Songs to seed into the database
const seedSongs = [
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    releaseYear: 2017,
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    releaseYear: 2020,
  },
  {
    title: "Someone Like You",
    artist: "Adele",
    album: "21",
    releaseYear: 2011,
  },
  {
    title: "Green Green Grass",
    artist: "George Ezra",
    album: "Gold Rush Kid",
    releaseYear: 2022,
  },
  {
    title: "Late Night Talking",
    artist: "Harry Styles",
    album: "Harrys House",
    releaseYear: 2022,
  },
];

// 3. Add the songs
async function addSongs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Song.deleteMany({}); // delete the previous data
    await Song.insertMany(seedSongs);
    console.log("Seeded songs!");
  } catch (error) {
    console.error("Seeding failed", error);
  } finally {
    // action the finally statement no matter songs succeed or failed
    await mongoose.disconnect(); // 4. Disconnect the connection to database
  }
}

addSongs();

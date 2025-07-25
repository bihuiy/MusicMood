// 1. connect database
import mongoose from "mongoose";
import dotenv from "dotenv";
import Song from "../models/song.js";

dotenv.config();

// 2. Songs to be uploaded into the database
const seedSongs = [
  {
    title: "Riptide",
    artist: "Vance Joy",
    album: "Dream Your Life Away",
    releaseYear: 2014,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753337227/Riptide_sdz6eh.webp",
  },
  {
    title: "Stitches",
    artist: "Shawn Mendes",
    album: "Handwritten",
    releaseYear: 2015,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753338736/Stitches_ngdf7r.avif",
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    releaseYear: 2020,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753335462/Blinding_Lights_ogeykh.avif",
  },
  {
    title: "Roar",
    artist: "Katy Perry",
    album: "PRISM",
    releaseYear: 2013,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753337506/Roar_v9ivpz.avif",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    releaseYear: 2017,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753335082/shape_of_you_fwti1l.webp",
  },
  {
    title: "Someone Like You",
    artist: "Adele",
    album: "21",
    releaseYear: 2011,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753335646/Someone_Like_You_w1rzge.avif",
  },
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    album: "1989",
    releaseYear: 2014,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753339291/Blank_Space_xnpzao.avif",
  },
  {
    title: "Late Night Talking",
    artist: "Harry Styles",
    album: "Harrys House",
    releaseYear: 2022,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753336106/Late_Night_Talking_ononmi.avif",
  },
  {
    title: "We Don't Talk Anymore (feat.Selena Gomez)",
    artist: "Charlie Puth",
    album: "Nine Track Mind",
    releaseYear: 2016,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753338208/We_Don_t_Talk_Anymore_n0sy7u.avif",
  },
  {
    title: "Jar Of Love",
    artist: "Wanting",
    album: "Everything In The World",
    releaseYear: 2012,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753337013/Jar_Of_Love_ztwgrd.avif",
  },
  {
    title: "Attention",
    artist: "Charlie Puth",
    album: "Voicenotes",
    releaseYear: 2018,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753338207/Attention_jwbqno.avif",
  },
  {
    title: "Counting Stars",
    artist: "OneRepublic",
    album: "Native",
    releaseYear: 2013,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753339025/Counting_Stars_xulrvg.avif",
  },
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    album: "Divide",
    releaseYear: 2017,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753336786/Perfect_okkwun.avif",
  },
  {
    title: "Who Says",
    artist: "Selena Gomez",
    album: "When The Sun Goes Down",
    releaseYear: 2011,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753338327/Who_Says_nahizw.avif",
  },
  {
    title: "Green Green Grass",
    artist: "George Ezra",
    album: "Gold Rush Kid",
    releaseYear: 2022,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753335823/Green_Green_Grass_pp8cvf.avif",
  },
  {
    title: "Focus Flow",
    artist: "Brainy",
    album: "Deep Focus",
    releaseYear: 2023,
    songImage:
      "https://res.cloudinary.com/dnycwkg4c/image/upload/v1753428521/Deep_Focus_song_rroe9n.avif",
  },
];

// 3. Upload the songs
async function uploadSongs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Song.deleteMany({}); // delete the previous data
    await Song.insertMany(seedSongs);
    console.log("Songs uploaded!");
  } catch (error) {
    console.error("Upload failed", error);
  } finally {
    // action the finally statement no matter songs succeed or failed
    await mongoose.disconnect(); // 4. Disconnect the connection to database
  }
}

uploadSongs();

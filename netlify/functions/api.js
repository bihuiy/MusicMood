// * -------- Import Section --------
// 🚨 New dependency, `npm i serverless-http` and use it here:
import serverless from "serverless-http";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import passUserToView from "../middleware/passUserToView.js";
import passMessageToView from "../middleware/passMessageToView.js";
import Song from "../models/song.js";
import bodyParser from "../../middleware/bodyParser.js";

// * -------- Import Routers --------
import authRouter from "../controllers/auth.js";
import songsRouter from "../controllers/songs.js";
import profileRouter from "../controllers/profile.js";
import playlistsRouter from "../controllers/playlists.js";

// * -------- Const Section --------
const app = express();
const port = process.env.PORT || 3000;

// * -------- Middleware Section --------
app.use(bodyParser);
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static("public")); // add the css styling
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(passUserToView);
app.use(passMessageToView);

// * -------- Routes Section --------
// Home route
app.get("/", async (req, res, next) => {
  try {
    const limitedSongs = await Song.find().limit(8);
    res.render("index.ejs", { limitedSongs });
  } catch (error) {
    next(error);
  }
});

// * -------- Router files --------
// auth
app.use("/auth", authRouter);
// songs
app.use("/songs", songsRouter);
// profile
app.use("/profile", profileRouter);
// playlists
app.use("/playlists", playlistsRouter);

// * -------- Error middleware (ALWAYS COMES AFTER THE MAIN ROUTES OF THE APP) --------
// error page
app.use(async (err, req, res, next) => {
  console.log(err);
  const limitedSongs = await Song.find().limit(8);
  if (err.renderForm) {
    return res.status(400).render("index.ejs", {
      user: req.session.user || null,
      message: err.message,
      limitedSongs,
    });
  }
  return res.status(500).render("errors/error-page.ejs");
});

// 404 error
app.use((req, res) => {
  return res.status(404).render("errors/404.ejs");
});

// * -------- Server Section --------
/* mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
}); */

const startServers = async () => {
  try {
    // Database Connection
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🔒 Database connection established");

    // ****** IMPORTANT ******
    // ! 🚨 Remove app.listen
    // It will be replaced with the line at the bottom of this file
  } catch (error) {
    console.log(error);
  }
};

startServers();

// ! 🚨 Add this line
export const handler = serverless(app);

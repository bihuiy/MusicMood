// * -------- Import Section --------
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import passUserToView from "./middleware/passUserToView.js";
import passMessageToView from "./middleware/passMessageToView.js";

// Routers
import authRouter from "./controllers/auth.js";
import songsRouter from "./controllers/songs.js";
import profileRouter from "./controllers/profile.js";
import playlistsRouter from "./controllers/playlists.js";

// * -------- Const Section --------
const app = express();
const port = process.env.PORT || 3000;

// * -------- Middleware Section --------
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
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
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// * -------- Router files --------
// auth
app.use("/auth", authRouter);
// allSongs
app.use("/songs", songsRouter);
// profile
app.use("/profile", profileRouter);
// playlists
app.use("/playlists", playlistsRouter);

// * -------- Error middleware (ALWAYS COMES AFTER THE MAIN ROUTES OF THE APP) --------
// error page
app.use((err, req, res, next) => {
  console.log(err);
  if (err.renderForm) {
    return res.status(400).render("index.ejs", {
      user: req.session.user || null,
      message: err.message,
    });
  }
  return res.status(500).render("errors/error-page.ejs");
});

// 404 error
app.use((req, res) => {
  return res.status(404).render("errors/404.ejs");
});

// * -------- Server Section --------
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

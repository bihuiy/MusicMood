import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Sign Up
router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Check fields aren't empty
    if (username.trim() === "") throw new Error("Please provide a username.");
    if (password.trim() === "") throw new Error("Please provide a password.");

    // Use the req.body to check whether the username already exists
    const existingUser = await User.findOne({ username: username }); //findOne is a model method provided by Mongoose, used to query the MongoDB database and return the first document that matches the given condition.
    if (existingUser)
      // At the signup stage, the user is not logged in yet, so there’s no session or local variables set.
      // We use User.findOne({ username }) to query the database directly and check if the username already exists.
      throw new Error("Username already taken. Please try another.");

    // Check passwords match
    if (password !== confirmPassword)
      throw new Error("Passwords do not match.");

    // Create the user
    const user = await User.create(req.body);
    req.session.message = "Thanks for joining MusicMood! You are signed in.";

    // Modify the session for the user to include information about the user account
    // The presence of a req.session.user will indicate that the user is authenticated
    // because we have the session middleware in our server.js, every request will automatically have the req.session object. before we give the value to them like below codes, the session will exsit but empty
    req.session.user = {
      _id: user._id,
      username: user.username,
    };

    req.session.save(() => {
      // Redirect to the home page
      return res.redirect("/");
    });
  } catch (error) {
    error.renderForm = true;
    next(error);
  }
});

// Sign In
router.post("/sign-in", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username: username });
    if (!existingUser) throw new Error("Invalid credentials provided.");

    // Check if the passwords match. If they DONT, fail on a 401
    if (!bcrypt.compareSync(password, existingUser.password)) {
      throw new Error("Invalid credentials provided.");
    }

    req.session.user = {
      _id: existingUser._id,
      username: existingUser.username,
    };
    req.session.message = "You are now signed in. Enjoy MusicMood!";

    const redirectUrl = req.session.redirectTo || "/";
    req.session.redirectTo = null;

    req.session.save(() => {
      // Redirect to the home page
      return res.redirect(redirectUrl);
    });
  } catch (error) {
    error.renderForm = true;
    next(error);
  }
});

// Sign Out
router.get("/sign-out", (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});

export default router;

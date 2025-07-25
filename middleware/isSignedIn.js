const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  else {
    req.session.message = "Please sign in to continue.";
    //req.session.redirectTo = req.originalUrl;
    return res.redirect("/");
  }
};

export default isSignedIn;

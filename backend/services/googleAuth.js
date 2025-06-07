const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { pool } = require("../config/database");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const [rows] = await pool.query(
          "SELECT * FROM usuarios WHERE email = ?",
          [email]
        );
        let user = rows[0];
        if (!user) {
          await pool.query(
            "INSERT INTO usuarios (nombre, email, foto, google_id) VALUES (?, ?, ?, ?)",
            [
              profile.displayName,
              email,
              profile.photos[0]?.value || null,
              profile.id,
            ]
          );
          const [newRows] = await pool.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
          );
          user = newRows[0];
        }
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        return done(null, { ...user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

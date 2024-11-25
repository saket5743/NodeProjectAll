import LocalStrategy from 'passport-local';
import User from "../models/users.models";

export const initializingPassport = (passport: any) => {
  passport.use(new LocalStrategy.Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) return done(null, false);

      if (user.password !== password) return done(null, false);
      console.log("passport authenticate")
      return done(null, user);

    } catch (error) {
      return done(error, false);
    }
  }))

  // Serialize user
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id)
  })

  // Deserialize user
  passport.deserializeUser(async (id: string, done: any) => {
    try {
      const user = await User.findById(id);
      done(null, user)
    } catch (error) {
      done(error, false)
    }
  })
}
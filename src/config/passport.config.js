import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.7769b0b3e8c8f723",
        clientSecret: "2d9800f9375e373cf671cef59d709665e58d4d42",
        callbackURL: "http://127.0.0.1:8080/api/session/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const user = await UserModel.findOne({ email: profile._json.email });
          if (user) return done(null, user);

          const newUser = await UserModel.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          });
          return done(null, newUser);
        } catch (error) {
          return done("error to login whit github " + error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("User already exits");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          const result = await UserModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done("[LOCAL] Error al obtener user " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            console.log("User dont exist");
            return done(null, user);
          }

          if (!isValidPassword(user, password)) return done(null, false);

          return done(null, user);
        } catch (error) {
          console.log("error");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;

import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/mongo/models/user.model.js";
import {
  createHash,
  extractCookie,
  generateToken,
  isValidPassword,
} from "../utils.js";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import config from "./config.js";
import userModel from "../dao/mongo/models/user.model.js";
import cartModel from "../dao/mongo/models/cart.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

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
            req.logger.info("user alredy exist");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: await cartModel.create({}),
          };
          if (!first_name || !last_name || !email || !age) {
            req.logger.error("Faltan Datos");
          } else {
            const result = await UserService.create(newUser);
            return done(null, result);
          }
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

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: config.jwtPrivateKey,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;

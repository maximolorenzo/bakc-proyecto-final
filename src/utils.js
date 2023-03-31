import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import jwt from "jsonwebtoken";
import bcrypt, { hashSync } from "bcrypt";
import config from "./config/config.js";
import { faker } from "@faker-js/faker";

export default __dirname;

export const generateToken = (user) => {
  const token = jwt.sing({ user }, config.jwtPrivateKey, { expiresIn: "24h" });
  return token;
};

//ve si existe el token de la cookie y si esta aturizado

export const authToken = (req, res, next) => {
  const token = req.cookies[config.jwtCookieName];
  if (!token)
    return res.status(401).render("errors/base", { error: "Not Auth" });

  jwt.verify(token, jwtPrivateKey, (error, credentials) => {
    if (error)
      return res.status(403).render("errors/base", { error: "Not authorizad" });

    req.user = credentials.user;
    next();
  });
};

//extrae la cokkie
export const extractCookie = (req) => {
  return req && req.cookies ? req.cookies[config.jwtCookieName] : null;
};

export const createHash = (password) => {
  return bcrypt, hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      console.log("passportCall: user: ", user);
      if (!user) {
        return res.status(401).render("errors/base", {
          error: info.messages ? info.messages : info.toString(),
        });
        //return next();
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    const user = req.user.user;
    if (!user) return res.status(401).send({ error: "Unauthorized" });
    if (user.role != role)
      return res.status(403).send({ error: "No Permission" });
    next();
  };
};

faker.locale = "es";

export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    stock: faker.random.numeric(1),
    id: faker.database.mongodbObjectId(),
    image: faker.image.image(),
  };
};

import express from "express";
import run from "./run.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";

import session from "express-session";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const httpServer = app.listen(8080, () => console.log("Listening..."));
const io = new Server(httpServer);
httpServer.on("error", () => console.log("ERROR"));
run(io, app);

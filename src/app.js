import express from "express";
import run from "./run.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const MongoUri =
  "mongodb+srv://maximo:lorenzo1@clustertester.fvimsli.mongodb.net/?retryWrites=true&w=majority";
const MongoDbName = "Ecommerce";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MongoUri,
      dbName: MongoDbName,
    }),
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(MongoUri, { dbName: MongoDbName }, (error) => {
  if (error) {
    console.log("DB No conected...");
    return;
  }
  const httpServer = app.listen(8080, () => console.log("Listening..."));
  const io = new Server(httpServer);
  httpServer.on("error", () => console.log("ERROR"));
  run(io, app);
});

import express from "express";
import run from "./run.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import mongoose from "mongoose";
const app = express();

const uri =
  "mongodb+srv://maximo:lorenzo1@clustertester.fvimsli.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(
  uri,
  {
    dbName: "Ecommerce",
  },
  (error) => {
    if (error) {
      console.log("DB no conetada....");
      return;
    }
    const httpServer = app.listen(8080, () => console.log("Listening..."));
    const io = new Server(httpServer);
    httpServer.on("error", () => console.log("error"));

    run(io, app);
  }
);

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// import { Socket } from "socket.io";

import { Server } from "socket.io";

const path = require("path");
const express = require("express");
const app = express();
const socketIo = require("socket.io");
const router = express.Router();

//Setting
app.set("port", process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, "../", "public")));

const server = app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
router.get("/", function (_req: any, res: any) {
  res.send("Truc api");
});
//Web socket
const io: Server = socketIo(server, {
  cosr: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
require("./server/rooms.js")(io);
require("./server/game.js")(io);

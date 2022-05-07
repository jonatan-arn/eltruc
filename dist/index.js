"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const app = express();
const socketIo = require("socket.io");
app.set("port", process.env.PORT || 4000);
app.use(express.static(path.join(__dirname, "../", "public")));
const server = app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
});
const io = socketIo(server, {
    cosr: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.get("/", (_req, res) => {
    res.send("Truc api");
});
require("./server/rooms.js")(io);
require("./server/game.js")(io);
//# sourceMappingURL=index.js.map
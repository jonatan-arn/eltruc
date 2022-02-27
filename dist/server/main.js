"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const app = express();
const socketIo = require("socket.io");
app.set("port", process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, "../", "public")));
const server = app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
});
const io = socketIo(server, {
    cosr: {
        origin: "localhost:4200",
        methods: ["GET", "POST"],
    },
});
require("./rooms.js")(io);
require("./game.js")(io);
//# sourceMappingURL=main.js.map
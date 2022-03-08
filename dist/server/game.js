"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (io) {
    io.on("connection", function (socket) {
        socket.on("send:cards", (cards) => {
            const lobbyID = String(socket.data.room);
            io.to(lobbyID).emit("start:game", cards);
        });
        socket.on("played:card", (data) => {
            const lobbyID = String(socket.data.room);
            io.to(lobbyID).emit("played:card", data);
        });
        socket.on("player:truc", (data) => {
            io.to(data.playerLeft.id).emit("truc", data);
            io.to(data.playerRight.id).emit("truc", data);
        });
    });
};
//# sourceMappingURL=game.js.map
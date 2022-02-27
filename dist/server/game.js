"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (io) {
    io.on("connection", function (socket) {
        socket.on("send:cards", (cards) => {
            const lobbyID = String(socket.data.room);
            io.to(lobbyID).emit("start:game", cards);
        });
        socket.on("played:card", async (data) => {
            const lobbyID = String(socket.data.room);
            io.to(lobbyID).emit("played:card", data);
        });
    });
};
//# sourceMappingURL=game.js.map
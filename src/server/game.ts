import { Server, Socket } from "socket.io";

module.exports = function (io: Server) {
  io.on("connection", function (socket: Socket) {
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

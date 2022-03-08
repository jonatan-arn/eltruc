import { Server, Socket } from "socket.io";

module.exports = function (io: Server) {
  io.on("connection", function (socket: Socket) {
    socket.on("send:cards", (cards) => {
      const lobbyID = String(socket.data.room);
      io.to(lobbyID).emit("start:game", cards);
    });
    socket.on("played:card", (data) => {
      const lobbyID = String(socket.data.room);
      io.to(lobbyID).emit("played:card", data);
    });
    socket.on("player:truc", (data) => {
      //const lobbyID = String(socket.data.room);

      io.to(data.playerLeft.id).emit("truc", data);
      io.to(data.playerRight.id).emit("truc", data);
    });
  });
};

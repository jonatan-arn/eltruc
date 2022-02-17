import { Server, Socket } from "socket.io";

module.exports = function (io: Server) {
  io.on("connection", function (socket: Socket) {
    console.log("new conection", socket.id);
    socket.emit("connected", { id: socket.id });

    socket.on("disconnected", () => {
      console.log(socket.id + " disconected");
      socket.leave(socket.data.room);
      socket.disconnect();
    });
    socket.on("create:room", (data) => {
      console.log("Create room");

      const roomID = socket.id; //When create a room roomId and socket.id are equal
      socket.data.username = data.user;
      socket.data.room = roomID;

      socket.emit("connected:room", {
        user: data.user,
        room: roomID,
        id: socket.id,
      });
    });
    socket.on("join:room", (data) => {
      const user = data.user;
      const roomID = data.roomID;

      socket.data.username = user;
      socket.data.room = roomID;

      socket.join(roomID);

      let socketsRoom: string[] = [];
      const room = io.sockets.adapter.rooms.get(roomID);

      // @ts-ignore: Object is possibly 'null'.
      for (let r of room) {
        socketsRoom.push(r);
      }
      io.to(roomID).emit("new:player:owner", {
        user: user,
        room: roomID,
        id: socket.id,
      });
    });
    socket.on("updateplayers:room", (data) => {
      console.log("Emit to others players");
      const lobbyID = String(socket.data.room);
      io.to(lobbyID).emit("new:player", data.players);
    });
  });
};

export interface room {
  id: number;
  name: string;
  sockets: Socket[];
}

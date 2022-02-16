import { Socket } from "socket.io";

module.exports = function (io: Socket) {
  io.on("connection", function (socket: Socket) {
    console.log("new conection", socket.id);
    socket.emit("connected", { id: socket.id });

    socket.on("disconnected", () => {
      console.log(socket.id + " disconected");
      socket.leave(socket.data.room);
      socket.disconnect();
    });

    socket.on("create:room", (data) => {
      const roomId = socket.id; //When create a room roomId and socket.id are equal
      socket.data.username = data.user;
      socket.data.room = roomId;

      socket.data.playerNumber = 1;
      socket.join(roomId);

      socket.emit("connected:room", {
        user: data.user,
        room: roomId,
        id: socket.id,
      });
      //socket.emit("list:room", [socket.data.username]);

      socket.on("join:room", (data) => {
        socket.data.username = data.username;
        socket.join(data.id);
        let names: string[] = [];
        // const clients = io.sockets.adapter.rooms.get(data.id);
        // for (const clientID of clients) {
        //   const clientSocket = io.sockets.sockets.get(clientID);
        //   names.push(clientSocket.data.username);
        // }
        socket.emit("connected:room", data.id);
        io.in(data.id).emit("list:room", names);
      });
    });
  });
};

export interface room {
  id: number;
  name: string;
  sockets: Socket[];
}

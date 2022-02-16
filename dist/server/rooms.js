"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (io) {
    io.on("connection", function (socket) {
        console.log("new conection", socket.id);
        socket.emit("connected", { id: socket.id });
        socket.on("disconnected", () => {
            console.log(socket.id + " disconected");
            socket.leave(socket.data.room);
            socket.disconnect();
        });
        socket.on("create:room", (data) => {
            const roomId = socket.id;
            socket.data.username = data.user;
            socket.data.room = roomId;
            socket.data.playerNumber = 1;
            socket.join(roomId);
            socket.emit("connected:room", {
                user: data.user,
                room: roomId,
                id: socket.id,
            });
            socket.on("join:room", (data) => {
                socket.data.username = data.username;
                socket.join(data.id);
                let names = [];
                socket.emit("connected:room", data.id);
                io.in(data.id).emit("list:room", names);
            });
        });
    });
};
//# sourceMappingURL=rooms.js.map
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
            console.log("Create room");
            const roomID = socket.id;
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
            let socketsRoom = [];
            const room = io.sockets.adapter.rooms.get(roomID);
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
//# sourceMappingURL=rooms.js.map
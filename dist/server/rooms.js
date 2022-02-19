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
            let roomID = "" + Math.floor(Math.random() * 90000) + 10000;
            let checkRoom = io.sockets.adapter.rooms.get(roomID);
            if (checkRoom == undefined)
                socket.join(roomID);
            while (checkRoom != undefined) {
                console.log("redo roomID");
                roomID = "" + Math.floor(Math.random() * 90000) + 10000;
                checkRoom = io.sockets.adapter.rooms.get(roomID);
            }
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
            let socketsRoom = [];
            const room = io.sockets.adapter.rooms.get(roomID);
            if (room == undefined) {
                socket.emit("undefined:room");
            }
            else {
                for (let socketID of room) {
                    socketsRoom.push(socketID);
                }
                if (socketsRoom.length == 4) {
                    socket.emit("full:room");
                }
                else {
                    socketsRoom.push(socket.id);
                    socket.data.username = user;
                    socket.data.room = roomID;
                    socket.join(roomID);
                    socket.emit("connected:room", {
                        user: data.user,
                        room: roomID,
                        id: socket.id,
                    });
                    io.to(roomID).emit("new:player:owner", {
                        user: user,
                        room: roomID,
                        id: socket.id,
                    });
                }
            }
        });
        socket.on("updateplayers:room", (data) => {
            console.log("Emit to others players");
            const lobbyID = String(socket.data.room);
            io.to(lobbyID).emit("new:player", data.players);
        });
    });
};
//# sourceMappingURL=rooms.js.map
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
            let roomID = "" + Math.floor(Math.random() * 90) + 100;
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
        socket.on("join:room", async (data) => {
            const user = data.user;
            const roomID = data.roomID;
            const room = io.sockets.adapter.rooms.get(roomID);
            if (room == undefined) {
                socket.emit("undefined:room");
            }
            else {
                const sockets = await io.in(roomID).fetchSockets();
                let socketsUsers = [];
                for (let s of sockets)
                    socketsUsers.push(s.data.username);
                if (socketsUsers.includes(user))
                    socket.emit("name:in:room");
                else if (sockets.length == 4) {
                    socket.emit("full:room");
                }
                else {
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
            const lobbyID = String(socket.data.room);
            io.to(lobbyID).emit("new:player", data.players);
        });
        socket.on("leave:room", (data) => {
            const lobbyID = String(socket.data.room);
            let players = [];
            for (let p of data.players) {
                if (p.id != socket.id)
                    players.push(p);
            }
            socket.leave(lobbyID);
            io.to(lobbyID).emit("leave:player", {
                players: players,
                socketLeave: socket.data,
            });
        });
    });
};
//# sourceMappingURL=rooms.js.map
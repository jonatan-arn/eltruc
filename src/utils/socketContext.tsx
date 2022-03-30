import { Socket, io } from "socket.io-client";

var socket: Socket;
export const connection = () => {
  socket = io("http://localhost:4000/", {
    transports: ["websocket"],
  });
  socket.emit("connection");

  return socket;
};

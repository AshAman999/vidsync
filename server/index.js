const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  var currentRoom;

  socket.on("join_room", (data) => {
    socket.join(data.room);
    currentRoom = {
      room: data.room,
      author: data.author,
    };
    console.log(
      `User with ID: ${socket.id}  ${data.author}joined room: ${data.room}`
    );

    const messageData = {
      room: data.room,
      author: "admin",
      message: `${data.author} has joined the room`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.to(data.room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    const messageData = {
      room: currentRoom.room,
      author: "admin",
      message: `${currentRoom.author} has left the room`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.to(currentRoom.room).emit("receive_message", messageData);

    console.log("User Disconnected", socket.id, currentRoom.room);
  });
  socket.on("videourl", (data) => {
    socket.to(data.room).emit("videourl", data);
  });
  socket.on("play", (data) => {
    socket.to(data.room).emit("play", data);
  });
  socket.on("pause", (data) => {
    socket.to(data.room).emit("pause", data);
  });
  socket.on("setPlaybackRate", (data) => {
    socket.to(data.room).emit("setPlaybackRate", data);
  });
  socket.on("currentTimeStamp", (data) => {
    socket.to(data.rooom).emit("currentTimeStamp", data);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(3002, () => {
  console.log("SERVER RUNNING");
});

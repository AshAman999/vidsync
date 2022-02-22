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
function getCurrentTime() {
  return (
    //get current time in hh:mm format
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  );
}
io.on("connection", (socket) => {
  var currentRoom;
  socket.on("join_room", (data) => {
    socket.join(data.room);
    currentRoom = {
      room: data.room,
      author: data.author,
    };
    console.log(
      `User with ID: ${socket.id}  ${data.author} joined room: ${data.room}`
    );

    const messageData = {
      room: data.room,
      author: "admin",
      message: `${data.author} has joined the room`,
      time: getCurrentTime(),
    };
    socket.to(data.room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    const messageData = {
      room: currentRoom == null ? "" : currentRoom.room,
      author: "admin",
      message: `${
        currentRoom == null ? "" : currentRoom.author
      } has left the room`,
      time: getCurrentTime(),
    };
    socket.to(messageData.room).emit("receive_message", messageData);

    console.log("User Disconnected", socket.id);
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
    io.in(data.room).emit("receive_message", data);
    console.log(data);
  });
  socket.on("notify_people", (data) => {
    io.in(data.room).emit("receive_message", data);

    console.log(data);
  });
});

server.listen(3002, () => {
  console.log("SERVER RUNNING");
});

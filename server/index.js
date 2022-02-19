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
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  socket.on("videourl", (data) => {
    socket.to(data.room).emit("videourl", data);
    io.emit("videourl", data);
    console.log(data, socket.id);
  });
  socket.on("play", (data) => {
    socket.to(data.room).emit("play", data);
    io.emit("play", data);
    console.log(data, socket.id);
  });

  socket.on("pause", (data) => {
    socket.to(data.room).emit("pause", data);
    io.emit("pause", data);
    console.log(data, socket.id);
  });
  socket.on("setPlaybackRate", (data) => {
    socket.to(data.room).emit("setPlaybackRate", data);
    io.emit("setPlaybackRate", data);
    console.log(data, socket.id);
  });
  socket.on("currentTimeStamp",(data)=>{
        socket.to(data.rooom).emit("currentTimeStamp",data);
        io.emit("currentTimeStamp",data);
        console.log(data,socket.id);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
      // io.emit("videourl", data);
      console.log(data, socket.id);
    });
});

server.listen(3002, () => {
  console.log("SERVER RUNNING");
});

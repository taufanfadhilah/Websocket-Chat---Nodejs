const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;

// socket io
const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUsers,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const botName = "ChatCord Bot";

// run when client connects
io.on("connection", (socket) => {
  //   console.log("new websocket connection");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // for single client
    socket.emit("message", formatMessage(botName, "Welcome to chatcord!"));

    // broadcast when a user connect (for multiple clients with same room)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // run when client disconnect
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });

  // listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUsers(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // for all clients
  //   io.emit()
});

// set static folder
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server are running on port ${PORT}`));

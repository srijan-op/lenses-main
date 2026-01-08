const express = require("express");
const app = express();
require("dotenv").config();
const { chats } = require("./data/data");
const { connect } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

connect();
app.use(express.json()); //to except json data
// deployment
// deployment
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    console.log("API running successfully");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

const io = require("socket.io")(start, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("setup", ({ userId }) => {
    socket.join(userId);
    socket.emit("connected");
    console.log("joined room");
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stopTyping");
  });

  socket.on("joinChat", (room) => {
    console.log(room);
    socket.join(room);
  });

  socket.on("newMessage", (newMessageReceived) => {
    console.log(newMessageReceived);
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("Chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("messageReceived", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("disconnected");
  });
});

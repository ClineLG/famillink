const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require("dotenv").config();

app.use(cors());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

app.use(express.json());

const Message = require("./models/Message");

//Routes Familly to add
//Routes User to add

//instant messages config//

io.on("connection", (socket) => {
  console.log("un utilisateur est connecté" + socket.id);

  try {
    socket.on("joinFamily", (familyCode) => {
      try {
        socket.join(familyCode);
        console.log(
          "utilisateur" + socket.id + "a rejoint la famille" + familyCode
        );
      } catch (error) {
        console.log(error);
        socket.emit("error Cannot do that for now");
      }
    });

    socket.on("sendMessage", async (MsgData) => {
      try {
        console.log("message nouveau : " + MsgData);

        const newMessage = new Message({
          text: MsgData.text,
          sender: MsgData.senderId,
          familly: MsgData.familyId,
          date: new Date(),
        });

        newMessage.save();
        io.to(MsgData.familyCode).emit("receiveMessage", MsgData);
      } catch (error) {
        console.log(error);
        socket.emit("error, cannot do that for now");
      }
    });

    socket.on("disconnect", () => console.log("user Disconnected"));
  } catch (error) {
    console.log("Connection error ", error);
  }
});

app.get("/", (req, res) => {
  res.send("Welcome on Familink");
});

app.listen(process.env.PORT, () => {
  console.log("Server Started 🥰");
});

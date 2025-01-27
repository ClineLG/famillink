const mongoose = require("mongoose");

const Message = mongoose.model("Message", {
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
});

module.exports = Message;

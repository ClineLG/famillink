const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: { String, unique: true },
  avatar: Object,
  token: String,
  hash: String,
  salt: String,
  famillies: { type: mongoose.Schema.Types.ObjectId, ref: "Familly" },
});
module.exports = User;

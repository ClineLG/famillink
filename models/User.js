const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  avatar: Object,
  email: String,
  token: String,
  hash: String,
  salt: String,
  families: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
});
module.exports = User;

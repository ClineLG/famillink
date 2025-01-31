const mongoose = require("mongoose");
// const Message = require("./Message");

const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  createdBy: String,
});

const ShopSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  createdBy: String,
});

const Family = mongoose.model("Familly", {
  name: String,
  avatar: Object,
  galery: Array, //pictures gallery
  shopList: [ShopSchema],
  calendar: [EventSchema],
  // message: [Message],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = Family;

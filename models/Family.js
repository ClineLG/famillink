const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ShopSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Family = mongoose.model("Familly", {
  name: { String, unique: true },
  avatar: Object,
  famillyCode: { type: String, unique: true, required: true },
  gallery: Array, //pictures gallery
  shopList: [ShopSchema],
  calendar: [EventSchema],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = Family;

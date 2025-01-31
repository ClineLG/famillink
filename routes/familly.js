const express = require("express");

const router = express.Router();

const Family = require("../Models/Family");

const isAuthenticated = require("../middleware/isAuthenticated");
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.get("/family/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const Familly = await Family.findById(id).populate("members");
    res.status(200).json({ Familly });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});
router.post("/family/:id/event", isAuthenticated, async (req, res) => {
  try {
    const { name, description, date } = req.body;
    const { id } = req.params;
    const family = await Family.findById(id);
    family.calendar.push({
      name: name,
      description: description,
      date: Date(date),
      createdBy: req.user,
    });

    await family.save();
    res.status(201).json(family.calendar);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/family/:id/shop", isAuthenticated, async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const { id } = req.params;
    const family = await Family.findById(id);
    family.shopList.push({
      name: name,
      quantity: quantity,
      createdBy: req.user,
    });
    await family.save();
    res.status(201).json(family.shopList);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post(
  "/family/:id/galery",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const { folder } = req.body;
      const { id } = req.params;
      const family = await Family.findById(id);

      const arr = req.files.images;
      const arrOfPromises = arr.map((pix) => {
        return (
          cloudinary.uploader.upload(convertToBase64(pix)),
          {
            folder: `Familink/${id}/${folder}`,
          }
        );
      });
      //faire recherche dossier existant family.galery

      //[{a:[a,a,a,a,a]},{b:[a,a,a,a,a]},{c:[a,a,a,a,a]}]

      const filtered = family.galery.filter((e) => e[folder]);
      if (filtered.length > 0) {
        filtered[0][folder].push(await Promise.all(arrOfPromises));
      } else {
        const obj = {};
        obj[folder] = [];
        obj[folder].push(await Promise.all(arrOfPromises));
        family.galery.push(obj);
      }

      await family.save();
      res.status(201).json(family.galery);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

module.exports = router;

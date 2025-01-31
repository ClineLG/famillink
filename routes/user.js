const express = require("express");

const router = express.Router();

const User = require("../Models/User");

const Family = require("../Models/Family");

const uid2 = require("uid2");

const SHA256 = require("crypto-js/sha256");

const encBase64 = require("crypto-js/enc-base64");

const fileUpload = require("express-fileupload");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const convertToBase64 = require("../utils/convertToBase64");

router.post("/signup", fileUpload(), async (req, res) => {
  //insert jwt or see clerk
  try {
    const { password, username, code, name, email } = req.body;

    if (!password || !username || !email) {
      return res.status(400).json({ message: "Parametters missing" });
    }

    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return res.status(400).json({ message: "email already used" });
    }
    const salt = uid2(24);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(18);

    const newUser = new User({
      username: username,
      email: email,
      token: token,
      hash: hash,
      salt: salt,
    });

    if (req.files) {
      if (req.files.userAvatar) {
        const convertedImage = convertToBase64(req.files.userAvatar);
        const image = await cloudinary.uploader.upload(convertedImage, {
          folder: `Familink/user/${newUser._id}`,
        });
        newUser.avatar = {
          secure_url: image.secure_url,
          public_id: image.public_id,
        };
      }
    }
    if (code) {
      const isFamilyExist = await Family.findById(code);
      if (isFamilyExist) {
        newUser.families.push(isFamilyExist);
        isFamilyExist.members.push(newUser);
        await isFamilyExist.save();
      } else {
        res.status(404).json({ message: "Family not found" });
      }
    } else {
      const newFamily = new Family({
        name: name,
      });

      if (req.files) {
        if (req.files.FamilyAvatar) {
          const convertedImage = convertToBase64(req.files.FamilyAvatar);
          const image = await cloudinary.uploader.upload(convertedImage, {
            folder: `Familink/${newFamily._id}/`,
          });
          newUser.avatar = {
            secure_url: image.secure_url,
            public_id: image.public_id,
          };
        }
      }
      newFamily.members.push(newUser);
      newUser.families.push(newFamily);
      await newFamily.save();
    }

    await newUser.save();

    res.status(200).json({
      _id: newUser._id,
      token: newUser.token,
      username: newUser.username,
      avatar: newUser.avatar,
      families: newUser.families,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

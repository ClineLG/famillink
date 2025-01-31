const User = require("../Models/User");

const isAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (user.families.includes(req.params.id)) {
      req.user = user.username;
      req.families = user.families;
      next();
    } else {
      res
        .status(401)
        .json({ message: "unauthorized to access to this family" });
    }
  }
};
module.exports = isAuthenticated;

const User = require("../models/User");

exports.getOperators = async (req, res) => {
  try {
    const users = await User.find({ role: "operator" }).select("username");
    res.json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch operators", error: err.message });
  }
};

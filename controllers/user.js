const User = require("../models/user");

//@description       create new user
//@route        POST /api/v1/users
//@access       Public
exports.createUser = async (req, res, next) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({
      success: true,
      data: user,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res
      .status(200)
      .json({ success: true, message: "Login successful.", data: user, token });
  } catch (error) {
    res.status(400).json({ success: false, error: "Unable to login" });
  }
};

exports.readUser = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ success: false, error: "users not found" });
    }

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ success: false, error: "Invalid Update." });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);

    // if (!user) {
    //   return res.status(404).send({ success: false, error: "User not found" });
    // }
    await req.user.remove();
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

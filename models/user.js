const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Invalid password");
      }
    },
  },
  role: {
    type: String,
    lowercase: true,
    enum: ["customer", "admin", "vendor"],
    default: "customer",
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "owner",
});

//Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

//Login Users.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to Login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to Login");
  }
  return user;
};

//Generate Auth token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, "pringles");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//hide password and token.
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/config.js";
import { publishToQueue } from "../broker/rabbit.js";

export async function register(req, res) {
  const {
    email,
    password,
    fullname: { firstName, lastName },
    role = "user",
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    password: hash,
    fullname: {
      firstName,
      lastName,
    },
    role,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role, fullname: user.fullname },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  await publishToQueue("user created", {
    userId: user._id,
    email: user.email,
    fullname: user.fullname,
    role: user.role,
  });

  res.cookie("token", token);

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export async function googleAuthCallback(req, res) {
  const user = req.user;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email: user.emails[0].value }, { googleId: user.id }],
  });

  if (isUserAlreadyExists) {
    const token = jwt.sign(
      {
        id: isUserAlreadyExists._id,
        role: isUserAlreadyExists.role,
        fullname: isUserAlreadyExists.fullname,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token);

    if (isUserAlreadyExists.role === "artist") {
      return res.redirect("http://localhost:5173/artist/dashboard"); // Redirect to artist dashboard
    }

    res.redirect("http://localhost:5173"); // Redirect to your frontend URL
  }

  const newUser = await userModel.create({
    email: user.emails[0].value,
    googleId: user.id,
    fullname: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role, fullname: newUser.fullname },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  await publishToQueue("user created", {
    userId: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
    role: newUser.role,
  });

  res.cookie("token", token);

  res.redirect("http://localhost:5173"); // Redirect to your frontend URL
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      fullname: user.fullname,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

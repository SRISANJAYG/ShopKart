import User from "../models/customer.model.js";
import bcrypt from "bcrypt";
import genToken from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
};

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    if (!fullName || !email || !password || !phone) {
      res.status(400).json({ message: "All Fields Required" });
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      res.status(409).json({ message: "Email Already Exists" });
    }
    if (password.length <= 6) {
      return res.status(400).json({
        message: "Password should contain more 6 character",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });
    const token = genToken(newUser._id);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: "Customer Registered", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server crashed", error: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields Required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(401).json({ message: "Password Did not Match " });
    }
    console.log(passwordMatched);
    const token = genToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User Logged In",
    });
  } catch (error) {
    res.status(500).json({ message: "Server crashed", error: error.message });
  }
};

export const getMe = async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    user,
  });
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const changepassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      res.status(400).json({
        message: "Old password and new password are required",
      });
    }
    const user = req.user;
    const passwordMatched = await bcrypt.compare(oldpassword, user.password);
    if (!passwordMatched) {
      return res.status(401).json({
        message: "old password is incorrect",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

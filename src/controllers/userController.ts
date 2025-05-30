import { Request, Response } from "express";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { error } from "console";
import bcrypt from "bcrypt";
import { userValidation } from "../validation/userValidation";


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = userValidation.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ userName, email, password: hashedPassword, });
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    // user.token = token;
    console.log("User token generated--------------:", user);
    await user.save();


    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Something went wrong" });
  }


}

function next() {
  throw new Error("Function not implemented.");
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }


    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    existingUser.token = token;
    console.log("User token generated--------------:", existingUser);
    await existingUser.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(200).json({ token, message: "User registered successfully" });

  }
  catch (error: any) {
    console.error(error); // For debugging
    return res.status(500).json({ error: "Server error during login" });
  }


};

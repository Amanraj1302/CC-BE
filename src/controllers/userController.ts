import { Request, Response } from "express";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { error } from "console";
import bcrypt from "bcrypt";
import { userValidation } from "../validation/userValidation";
import { sendOtpEmail } from "../utils/sendEmail";


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
    const { userName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    //  Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //  Set expiration to 5 minutes from now
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ userName, email, role, password: hashedPassword, otp, otpExpiry, isVerified: false });
    
    await user.save();
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: 'User registered successfully. Please check your email for OTP.' });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || 'Something went wrong' });
  }


}

// function next() {
//   throw new Error("Function not implemented.");
// }

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
   
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
    
    await existingUser.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(200).json({name: existingUser.userName,role: existingUser.role, artist_id:existingUser.artistId, message: "User registered successfully" });
  }
  catch (error: any) {
    
    return res.status(500).json({ error: "Server error during login" });
  }
};

// Otp verification function
export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;


  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.isVerified) return res.status(400).json({ error: 'User already verified' });

  if (user.otp !== otp.toString()) return res.status(400).json({ error: 'Invalid OTP' });

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    return res.status(400).json({ error: 'OTP has expired' });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return res.status(200).json({ message: 'OTP verified successfully' });
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ data: { email: user.email ,userName:user.userName, role:user.role} });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

// change-passowrd controller : --
export const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({ error: "Server error during password change" });
  }
};
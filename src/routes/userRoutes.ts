import express, { Router } from "express";
import  {registerUser, loginUser , verifyOtp, getDetails, logoutUser,changePassword}  from "../controllers/userController";
import { authentication } from "../middleware/authentication";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/getDetails",authentication as express.RequestHandler,getDetails as express.RequestHandler);
router.post("/logout",logoutUser as unknown as express.RequestHandler);
router.post("/change-password", authentication as express.RequestHandler, changePassword as express.RequestHandler);
export { router as userRoutes };





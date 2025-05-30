import express, { Router } from "express";
import  {registerUser, loginUser}  from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
export { router as userRoutes };





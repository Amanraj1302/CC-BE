import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("calling");
        const token = req.cookies.token;
        console.log(token);
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(decodedToken);
        (req as any).userId = decodedToken.userId.toString();
        next();
    } catch (err) {
        console.error("Error in authentication middleware:", err);
        res.status(500).json({ message: "Server error" });``
    }
}
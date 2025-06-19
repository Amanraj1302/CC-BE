// middleware/checkRole.ts

import { Request, Response, NextFunction } from "express";

export const checkRole = (role: "artist" | "director") => {
    
  return (req: any, res: Response, next: NextFunction) => {
    // if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    // const user  = 
    // if (user.role !== 'artist') {
    //   return res.status(403).json({ message: "Access denied: wrong role" });
    // }

    next();
  };
};

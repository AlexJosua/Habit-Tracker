import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      name: string;
      email: string;
    };
    req.user = {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const verifyToken = authenticateToken;

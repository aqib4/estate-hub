import {Request,Response, NextFunction } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken"

interface DecodedToken extends JwtPayload {
      sub: string;
      "custom:role"?: string; 

}

declare global{
    namespace Express {
        interface Request {
            user?: {
                id:string;
                role:string;
            }
        }
    }
}

export const authMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Authorization Header:", req.headers.authorization);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const decoded = jwt.decode(token) as DecodedToken;
            
            // FIX: Use empty string as default, not space
            const userRole = decoded["custom:role"] || "";
            
            // FIX: Add validation for empty role
            if (!userRole) {
                console.log("User role is missing from token");
                return res.status(403).json({ message: "User role not found in token" });
            }

            req.user = {
                id: decoded.sub,
                role: userRole
            };

            // FIX: Better logging for debugging
            console.log(`User role: "${userRole}", Allowed roles:`, allowedRoles);
            
            const hasAccess = allowedRoles.includes(userRole.toLowerCase());
            
            if (!hasAccess) {
                console.log(`Access denied for role: "${userRole}"`);
                return res.status(403).json({ message: "Access Denied!" });
            }

            next(); // ✅ Move next() inside try block after successful auth

        } catch (error: any) {
            console.log("Failed to authenticate token:", error.message);
            return res.status(401).json({ message: "Invalid Token" });
        }
    };
};
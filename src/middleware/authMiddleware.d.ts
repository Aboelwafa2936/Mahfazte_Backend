import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import { Document } from "mongoose";
declare global {
    namespace Express {
        interface Request {
            user: (IUser & Document);
        }
    }
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authMiddleware.d.ts.map
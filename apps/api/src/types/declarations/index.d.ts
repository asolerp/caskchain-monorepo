// file: types.d.ts
// THIS LINE IS REQUIRED
import { SessionData } from "express-session";

declare module "express-session" {
    export interface SessionData {
        messageSession: {
            contractAddress: string;
            id: string;
        };
    }
}
export interface User {
  id?: number,
  name: string,
  email: string,
  password: string,
}

export type Status = "checking..." | "success" | "error" | "notTriggered"

declare module "express-session" {
    interface Session {
        user_name: string,
        user_email: string
    }
}
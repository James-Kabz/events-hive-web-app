import { DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & {
      roles: string[];
      permissions: string[];
      accessToken?: string;
    };
  }

  interface User {
    roles: string[];
    permissions: string[];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: string[];
    permissions: string[];
    accessToken?: string;
  }
}
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { Adapter } from "@auth/core/adapters";
import axios from "axios";
import Google from "next-auth/providers/google";
import { prisma } from './lib/prisma';

interface SignInSchema {
  id: string,
  email: string,
  password: string,
  roles:string[]
  permissions: string[],
  accessToken: string
}

interface ApiError {
  response? : {
    data?: unknown
  };
  message: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Credentials ({
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },

      authorize: async (credentials ) => {
        if (!credentials?.email || !credentials?.password) return null;

        try{
          const response = await axios.post<SignInSchema>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
            //  credentials
            {
              email: credentials.email,
              password: credentials.password
            });
            
            if (!response.data.accessToken) {
              console.error("Access token not found");
              return null;
            }
            
            return response.data;
        } catch (error) {
          const apiError = error as ApiError;
          console.error(
            "Authorization error:",
            apiError.response?.data || apiError.message
          );
          return null; 
        }

      },
    }),

    Google({
      allowDangerousEmailAccountLinking: true
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
})
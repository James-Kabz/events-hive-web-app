import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios";
import Google from "next-auth/providers/google";
// Remove PrismaAdapter import
// import { PrismaAdapter } from '@auth/prisma-adapter';

interface SignInSchema {
  id: string,
  email: string,
  password: string,
  roles: string[]
  permissions: string[],
  accessToken: string
}

interface ApiError {
  response?: {
    data?: unknown
  };
  message: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  // Remove adapter for Edge compatibility
  // adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await axios.post<SignInSchema>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`,
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

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "credentials") {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.roles = user.roles;
          token.permissions = user.permissions;
          token.accessToken = user.accessToken;
        } else if (account?.provider === "google") {
          // For Edge compatibility, move Prisma database operations to an API route
          // For now, we'll set basic properties directly from Google account
          token.id = user.id || "";
          token.name = user.name || "";
          token.email = user.email || "";
          token.roles = []; // These would need to be fetched from a compatible API
          token.permissions = []; // These would need to be fetched from a compatible API
          token.accessToken = account.access_token || "";
        }
        console.log("JWT Token Updated With Roles & Permissions", token);
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },

    async authorized({ auth }) {
      return !!auth;
    },
  },

  pages: {
    signIn: "auth/sign-in",
    error: "api/auth/error",
  }
});

// import { PrismaAdapter } from '@auth/prisma-adapter';
// import NextAuth from "next-auth"
// import Credentials from "next-auth/providers/credentials"
// import axios from "axios";
// import Google from "next-auth/providers/google";
// import { PrismaClient } from '@prisma/client';


// const prisma = new PrismaClient();
// interface SignInSchema {
//   id: string,
//   email: string,
//   password: string,
//   roles: string[]
//   permissions: string[],
//   accessToken: string
// }

// interface ApiError {
//   response?: {
//     data?: unknown
//   };
//   message: string
// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true,
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },

//       authorize: async (credentials) => {
//         if (!credentials?.email || !credentials?.password) return null;

//         try {
//           const response = await axios.post<SignInSchema>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`,
//             //  credentials
//             {
//               email: credentials.email,
//               password: credentials.password
//             });

//           if (!response.data.accessToken) {
//             console.error("Access token not found");
//             return null;
//           }

//           return response.data;
//         } catch (error) {
//           const apiError = error as ApiError;
//           console.error(
//             "Authorization error:",
//             apiError.response?.data || apiError.message
//           );
//           return null;
//         }

//       },
//     }),

//     Google({
//       allowDangerousEmailAccountLinking: true
//     }),
//   ],

//   secret: process.env.NEXTAUTH_SECRET,


//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (user) {
//         if (account?.provider === "credentials") {
//           token.id = user.id;
//           token.name = user.name;
//           token.email = user.email;
//           token.roles = user.roles;
//           token.permissions = user.permissions;
//           token.accessToken = user.accessToken;
//         } else if (account?.provider === "google") {
//           const dbUser = await prisma.user.findUnique({
//             where: { email: user.email ?? undefined },
//             include: {
//               UserRole: {

//                 include: {

//                   role: {

//                     include: {

//                       RolePermission: {

//                         include: {
//                           permission: true
//                         },

//                       },

//                     },

//                   },

//                 },

//               },

//             },

//           });

//           token.id = dbUser?.id || "";
//           token.name = dbUser?.name || "";
//           token.email = dbUser?.email || "";

//           // extract the roles and permissions from the user object
//           token.roles = dbUser?.UserRole.map((userRole) => userRole.role.name) || [];
//           token.permissions = dbUser?.UserRole.flatMap((userRole) =>
//             userRole.role.RolePermission.map((rolePerms) =>
//               rolePerms.permission.name
//             )
//           ) || [];
//           token.accessToken = account.access_token || "";

//         }
//         console.log("JWT TOken Updated WIth Roles & Permissions", token);

//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.roles = token.roles;
//         session.user.permissions = token.permissions;
//         session.user.accessToken = token.accessToken;
//       }
//       return session;
//     },

//     async authorized({ auth }) {
//       return !!auth;
//     },
//   },

//   pages: {
//     signIn: "auth/sign-in",
//     error: "api/auth/error",
//   }
// });
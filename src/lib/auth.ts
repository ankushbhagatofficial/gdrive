import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { google } from "googleapis";

async function refreshAccessToken(token: any) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: token.refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    return {
      ...token,
      accessToken: credentials.access_token!,
      expiresAt: Math.floor((credentials.expiry_date ?? 0) / 1000),
      refreshToken: credentials.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

type Auth = {
  id: string,
  name: string,
  email: string,
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    Credentials({
      credentials: {
        id: {},
        name: {},
        email: {},
      },
      authorize: async (credentials) => {
        const user = credentials as Auth

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },

    })
  ],

  callbacks: {
    signIn: async ({ user, account }) => {

      if (account?.provider === "google") {

      }
      return true
    },

    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }

      console.log("AUTH-JWT: OK");
      
      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }

      if (token.accessToken)
        session.accessToken = token.accessToken as string

      console.log("AUTH-SESSION: OK");      

      return session
    }
  },


})

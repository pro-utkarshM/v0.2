import { betterAuth, BetterAuthOptions, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, haveIBeenPwned, username } from "better-auth/plugins";

import { db } from "~/db/connect";
import { accounts, sessions, users, verifications } from "~/db/schema";
import { appConfig } from "~/project.config";
import { mailFetch } from "../lib/fetch-server";

const VERIFY_EMAIL_PATH_PREFIX = "/auth/verify-mail";
const RESET_PASSWORD_PATH_PREFIX = "/auth/reset-password";

const baseUrl = new URL(process.env.BASE_URL);


export const betterAuthOptions = {
  appName: appConfig.name,
  baseURL: baseUrl.toString(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
    },
    //if all of them are just using plural form, you can just pass the option below
    usePlural: true,
  }),

  onAPIError: {
    throw: true,
    onError: (error, ctx) => {
      console.log("Auth error:", error);
      console.log("Auth error , context:", ctx);
    },
    // errorURL: "/auth/error",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // const verification_url = `${baseUrl}${RESET_PASSWORD_PATH_PREFIX}${token}`;
      const reset_link = new URL(process.env.BASE_URL as string);
      reset_link.pathname = RESET_PASSWORD_PATH_PREFIX;
      reset_link.searchParams.set("token", token);

      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "reset-password",
            targets: [user.email],
            subject: "Reset Password",
            payload: {
              name: user.name,
              email: user.email,
              reset_link: reset_link.toString(),
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email from mail server",
          });
        }
        console.log(response.data);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verification_url = new URL(process.env.BASE_URL as string);
      verification_url.pathname = VERIFY_EMAIL_PATH_PREFIX;
      verification_url.searchParams.set("token", token);
      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "welcome_verify",
            targets: [user.email],
            subject: `Welcome to ${appConfig.name}`,
            payload: {
              platform_name: appConfig.name,
              name: user.name,
              email: user.email,
              verification_url: baseUrl.toString(),
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email",
          });
        }
        console.log(response);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      mapProfileToUser: async (profile) => {
        return {
          image: profile.picture,
        };
      },
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: appConfig.appDomain,
    },
    cookiePrefix: "nith",
  },
  trustedOrigins: [
    "nith.eu.org", // Trust all subdomains of nith.eu.org
    "auth.nith.eu.org", // Trust all subdomains of nith.eu.org
    "app.nith.eu.org", // Trust all subdomains of nith.eu.org
    "platform.nith.eu.org", // Trust all subdomains of nith.eu.org
    "https://nith.eu.org", // Trust only HTTPS subdomains
    "https://auth.nith.eu.org", // Trust only HTTPS subdomains
    "https://app.nith.eu.org", // Trust only HTTPS subdomains
    "https://platform.nith.eu.org", // Trust only HTTPS subdomains
    "*.nith.eu.org", // Trust all subdomains of nith.eu.org
    "https://*.nith.eu.org", // Trust only HTTPS subdomains
    "https://*.dev.nith.eu.org", // Trust HTTPS subdomains of dev.nith.eu.org
  ],
  // trustedOrigins: [appConfig.url, `https://${appConfig.appDomain}`,`https://*.nith.eu.org`],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
        defaultValue: "user",
      },
      other_roles: {
        type: "string[]",
        required: true,
        input: true,
      },
      other_emails: {
        type: "string[]",
        required: false,
        input: false,
      },
      hostelId: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "not_specified",
      },
      gender: {
        type: "string",
        input: true,
        defaultValue: "not_specified",
      },
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
      department: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  session: {
    expiresIn: 604800, // 7 days
  },
  account: {
    encryptOAuthTokens: true, // Encrypt OAuth tokens before storing them in the database

    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "email-password"],
      allowDifferentEmails: false,
    },
  },

  plugins: [
    username(),
    admin({
      defaultRole: "user",
      adminRole: ["admin"],
      defaultBanExpiresIn: 60 * 60 * 24 * 7, // 1 week
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage: "Please choose a more secure password.",
    }),
    nextCookies(),
  ], // make sure this is the last plugin (nextCookies) in the array
  telemetry: {
    enabled: false,
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(betterAuthOptions);




export type Session = typeof auth.$Infer.Session;
export type SessionUser = typeof auth.$Infer.Session.user;

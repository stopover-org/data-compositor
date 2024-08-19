import NextAuth, { AuthOptions, TokenSet } from "next-auth";
import KeycloakProvider, {
  KeycloakProfile,
} from "next-auth/providers/keycloak";
import { OAuthConfig } from "next-auth/providers/oauth";
import { signOut } from "next-auth/react";
import { JWT } from "next-auth/jwt";
// @ts-ignore
import type { AdapterUser } from "next-auth/src/adapters";
// @ts-ignore
import { Session } from "next-auth/src/core/types";

const clientId = process.env.KEYCLOAK_CLIENT_ID || "";
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || "";
const keycloakIssuer = process.env.KEYCLOAK_ISSUER || "";

function parseJwt(token?: string) {
  if (!token) {
    return null;
  }
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

function requestRefreshOfAccessToken(token: JWT & Record<string, any>) {
  return fetch(`${keycloakIssuer}/protocol/openid-connect/token`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: token.refresh_token as string,
    }),
    method: "POST",
    cache: "no-store",
  });
}

async function signOutKeycloak(token: JWT & Record<string, any>) {
  const issuerUrl =
    // prettier-ignore
    (
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      authOptions.providers.find(
        (p) => p.id === "keycloak",
      ) as OAuthConfig<KeycloakProfile>
    ).options!.issuer!;
  const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`);

  logOutUrl.searchParams.set("id_token_hint", token.id_token as string);

  await fetch(logOutUrl);
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId,
      clientSecret,
      issuer: keycloakIssuer,
      idToken: true,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      const additional = parseJwt(token.id_token as string) || {};

      token = { ...additional, ...token };

      if (account) {
        token.id_token = account.id_token;

        token.access_token = account.access_token;

        token.refresh_token = account.refresh_token;

        token.expires_at = account.expires_at;
        return token;
      }

      if (
        !Array.isArray(token?.groups) ||
        !(token.groups as string[])
          .map((group: string) => group.toLowerCase())
          .includes("/analyst")
      ) {
        await signOutKeycloak(token);

        await signOut();
        return {};
      }

      try {
        const response = await requestRefreshOfAccessToken(token);
        const tokens: TokenSet = await response.json();

        if (!response.ok) throw tokens;

        const updatedToken: JWT = {
          ...token,
          id_token: tokens.id_token,
          access_token: tokens.access_token,
          expires_at: Math.floor(
            Date.now() / 1000 + (tokens.expires_in as number),
          ),
          refresh_token: tokens.refresh_token ?? token.refreshToken,
        };

        return updatedToken;
      } catch {
        await signOutKeycloak(token);

        await signOut();
        return {};
      }
    },
    async session({
      session,
      token,
    }: {
      session: Session & {
        id_token?: string;
      };
      token: JWT & any;
      user: AdapterUser;
    } & {
      newSession: any;
      trigger: "update";
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.id_token = token.id_token;
      return session;
    },
  },
  events: {
    async signOut({ token }: { token: JWT & Record<string, any> }) {
      await signOutKeycloak(token);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, genericOAuth } from "better-auth/plugins";
import type { AuthDatabase } from "./db";

export type OAuthConfig = {
	keycloak: {
		clientId: string;
		clientSecret: string;
		url: string;
		realm: string;
	};
};

export function getAuth(db: AuthDatabase, oauthConfig: OAuthConfig) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
		plugins: [
			// https://www.better-auth.com/docs/plugins/email-otp
			emailOTP({
				async sendVerificationOTP({ email, type, otp }) {
					// Output to console instead of actually sending an email
					console.log(
						`Sending verification OTP\nemail: ${email}\ntype: ${type}\nOTP: ${otp}`,
					);
				},
			}),
			// https://www.better-auth.com/docs/plugins/generic-oauth
			genericOAuth({
				config: [
					{
						providerId: "keycloak",
						clientId: oauthConfig.keycloak.clientId,
						clientSecret: oauthConfig.keycloak.clientSecret,
						discoveryUrl: `${oauthConfig.keycloak.url}/realms/${oauthConfig.keycloak.realm}/.well-known/openid-configuration`,
						scopes: ["openid"],
					},
				],
			}),
		],
	});
}

export type Auth = ReturnType<typeof getAuth>;

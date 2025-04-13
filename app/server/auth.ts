import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, genericOAuth } from "better-auth/plugins";
import type { AuthDatabase } from "./db";

export type AuthConfig = {
	emailOTP: {
		mockEmailOTP: string | undefined;
	};
	keycloak: {
		clientId: string;
		clientSecret: string;
		url: string;
		realm: string;
	};
};

export function getAuth(db: AuthDatabase, authConfig: AuthConfig) {
	const { keycloak } = authConfig;
	const mockEmailOTP = authConfig.emailOTP.mockEmailOTP;

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
				generateOTP:
					mockEmailOTP !== undefined ? () => mockEmailOTP : undefined,
			}),
			// https://www.better-auth.com/docs/plugins/generic-oauth
			genericOAuth({
				config: [
					{
						providerId: "keycloak",
						clientId: keycloak.clientId,
						clientSecret: keycloak.clientSecret,
						discoveryUrl: `${keycloak.url}/realms/${keycloak.realm}/.well-known/openid-configuration`,
						scopes: ["openid"],
					},
				],
			}),
		],
	});
}

export type Auth = ReturnType<typeof getAuth>;

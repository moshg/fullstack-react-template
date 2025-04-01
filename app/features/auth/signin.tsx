import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { authClient } from "~/lib/auth-client";
import { p } from "~/lib/path";

export default function SignIn() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const signInWithOAuth = async (providerId: string) => {
		setIsLoading(true);
		setError("");
		const { error } = await authClient.signIn.oauth2({
			providerId,
			callbackURL: p("/"), // redirect URL after sign in
		});

		if (error) {
			setError(error.message ?? "Unknown error");
			setIsLoading(false);
			return;
		}
	};

	return (
		<div className="container mx-auto py-8 max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
							{error}
						</div>
					)}
					<div className="mt-6">
						<Button
							type="button"
							variant="outline"
							className="w-full"
							onClick={() => signInWithOAuth("keycloak")}
							disabled={isLoading}
						>
							{isLoading ? "Processing..." : "Sign in with SSO"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RequiredBadge } from "~/components/ui/required-badge";
import { authClient } from "~/core/client/auth-client";
import { p } from "~/core/shared/path";
import type { UseLoadingReturn } from "../hooks/use-loading";
import { useLoading } from "../hooks/use-loading";

type SignInCardProps = {
	email: string;
	onEmailChange: (email: string) => void;
	afterEmailSubmit: () => void;
};

export function SignInCard({
	email,
	onEmailChange,
	afterEmailSubmit,
}: SignInCardProps) {
	const loading = useLoading();

	return (
		<div className="container mx-auto py-8 max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
				</CardHeader>
				<CardContent>
					{loading.errors.length > 0 && (
						<div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
							{loading.errors}
						</div>
					)}

					<EmailSignInForm
						email={email}
						onEmailChange={onEmailChange}
						afterEmailSubmit={afterEmailSubmit}
						loading={loading}
					/>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-border" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-background text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>
						<SSOSignInForm loading={loading} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

const emailSignInSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type EmailSignInFormProps = {
	email: string;
	onEmailChange: (email: string) => void;
	afterEmailSubmit: () => void;
	loading: UseLoadingReturn;
};

function EmailSignInForm({
	email,
	onEmailChange,
	afterEmailSubmit,
	loading,
}: EmailSignInFormProps) {
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const parseResult = emailSignInSchema.safeParse({ email });
		if (!parseResult.success) {
			loading.setErrors(parseResult.error.errors.map((e) => e.message));
			return;
		}

		await loading.withLoading(async () => {
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				type: "sign-in",
				email: parseResult.data.email,
			});

			if (error) {
				return {
					errors: [error.message ?? `${error.status}: ${error.statusText}`],
				};
			}

			afterEmailSubmit();
		});
	};

	return (
		<form method="post" className="space-y-4" onSubmit={handleSubmit}>
			<div>
				<Label htmlFor="email" className="mb-1.5">
					Email <RequiredBadge />
				</Label>
				<Input
					type="email"
					name="email"
					id="email"
					required
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
				/>
			</div>
			<input type="hidden" name="action" value="send" />
			<Button type="submit" className="w-full" disabled={loading.isLoading}>
				{loading.isLoading ? "Sending..." : "Continue with email"}
			</Button>
		</form>
	);
}

type SSOSignInFormProps = {
	loading: UseLoadingReturn;
};

function SSOSignInForm({ loading }: SSOSignInFormProps) {
	const signInWithOAuth = async (providerId: string) => {
		await loading.withLoading(async () => {
			const { error } = await authClient.signIn.oauth2({
				providerId,
				callbackURL: p("/"),
			});

			if (error) {
				console.error(error);
				return {
					errors: [error.message ?? `${error.status}: ${error.statusText}`],
				};
			}
		});
	};

	return (
		<div>
			<div className="mt-6">
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={() => signInWithOAuth("keycloak")}
					disabled={loading.isLoading}
				>
					{loading.isLoading ? "Processing..." : "Continue with SSO"}
				</Button>
			</div>
		</div>
	);
}

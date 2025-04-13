import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "~/components/ui/input-otp";
import { authClient } from "~/core/client/auth-client";
import { p } from "~/core/shared/path";

const schema = z.object({
	otp: z.string().length(6, "One-time password must be 6 characters"),
	email: z.string().email("Invalid email address"),
});

type VerifyOTPCardProps = {
	email: string;
	onBack: () => void;
};

export function VerifyOTPCard({ email, onBack }: VerifyOTPCardProps) {
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = schema.safeParse({ otp, email });

		if (!data.success) {
			setErrors(data.error.errors.map((e) => e.message));
			return;
		}

		setIsLoading(true);
		setErrors([]);

		try {
			const { error: verificationError } = await authClient.signIn.emailOtp({
				email,
				otp,
			});

			if (verificationError) {
				setErrors([verificationError.message ?? "Failed to verify OTP"]);
			} else {
				navigate(p("/"));
			}
		} catch (err) {
			console.error(err);
			setErrors(["An unexpected error occurred"]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto py-8 max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>Verify Email</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">
						Enter the 6-digit code sent to your email.
					</p>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="flex flex-col items-center space-y-4">
							<InputOTP
								maxLength={6}
								value={otp}
								onChange={(newOtp) => setOtp(newOtp)}
							>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
									<InputOTPSlot index={3} />
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
							</InputOTP>
						</div>
						<input type="hidden" name="email" value={email} />
						{errors.length > 0 && (
							<div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
								{errors.map((error) => (
									<div key={error}>{error}</div>
								))}
							</div>
						)}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Verifying..." : "Verify"}
						</Button>
					</form>
					<Button
						variant="link"
						className="w-full"
						onClick={onBack}
						disabled={isLoading}
					>
						Use different email
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

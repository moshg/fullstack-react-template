import { useState } from "react";
import { SignInCard } from "./components/signin-card";
import { VerifyOTPCard } from "./components/verify-otp-card";

export default function SignIn() {
	const [emailSent, setEmailSent] = useState(false);
	const [email, setEmail] = useState("");

	const handleEmailSubmit = () => {
		setEmailSent(true);
	};

	return emailSent ? (
		<VerifyOTPCard email={email} onBack={() => setEmailSent(false)} />
	) : (
		<SignInCard
			email={email}
			onEmailChange={setEmail}
			afterEmailSubmit={handleEmailSubmit}
		/>
	);
}

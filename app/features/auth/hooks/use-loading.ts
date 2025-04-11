import { useState } from "react";

export type LoadingState = {
	isLoading: boolean;
	errors: string[];
};

export type UseLoadingReturn = LoadingState & {
	startLoading: () => void;
	finishLoading: () => void;
	setErrors: (errors: string[]) => void;
	withLoading: (
		fn: () => Promise<{ errors?: string[] } | undefined>,
	) => Promise<void>;
};

export function useLoading(): UseLoadingReturn {
	const [state, setState] = useState<LoadingState>({
		isLoading: false,
		errors: [],
	});

	const startLoading = () => {
		setState({ isLoading: true, errors: [] });
	};

	const finishSuccessfully = () => {
		setState({ isLoading: false, errors: [] });
	};

	const finishWithError = (errors: string[]) => {
		setState({ isLoading: false, errors });
	};

	const withLoading = async (
		fn: () => Promise<{ errors?: string[] } | undefined>,
	): Promise<void> => {
		startLoading();
		try {
			const result = await fn();
			if (result?.errors) {
				finishWithError(result.errors);
			} else {
				finishSuccessfully();
			}
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				finishWithError([err.message]);
			} else {
				finishWithError(["An unexpected error occurred"]);
			}
		}
	};

	return {
		...state,
		startLoading,
		finishLoading: finishSuccessfully,
		setErrors: finishWithError,
		withLoading,
	};
}

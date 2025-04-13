import { cn } from "~/utils/props";

type RequiredBadgeProps = {
	className?: string;
};

export function RequiredBadge({ className }: RequiredBadgeProps) {
	return (
		<span
			className={cn("text-red-500", className)}
			aria-hidden="true"
			title="Required field"
		>
			*
		</span>
	);
}

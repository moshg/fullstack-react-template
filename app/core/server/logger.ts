import {
	transports,
	createLogger as winstonCreateLogger,
	format as winstonFormat,
} from "winston";
import { assertNever } from "~/utils/type";

export function createLogger(args: {
	format: "pretty" | "json";
	level: string;
	requestId: string;
}) {
	return winstonCreateLogger({
		level: args.level,
		format: winstonFormat.combine(
			winstonFormat.timestamp(),
			args.format === "pretty"
				? winstonFormat.prettyPrint()
				: args.format === "json"
					? winstonFormat.json()
					: assertNever(args.format),
		),
		defaultMeta: { requestId: args.requestId },
		transports: [new transports.Console()],
	});
}

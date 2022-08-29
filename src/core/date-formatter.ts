import { invariant } from "../utils/invariant.js";
import type { MuttiDate } from "./date.js";

/** Creates readable representations of different parts of an {@link MuttiDate}. */
export class MuttiDateFormatter {
	private readonly format: Intl.DateTimeFormat;

	constructor(locale: string, options?: Intl.DateTimeFormatOptions) {
		const resolvedOptions: Intl.DateTimeFormatOptions = {
			month: "short",
			...options,
		};
		this.format = new Intl.DateTimeFormat(locale, resolvedOptions);
	}

	public getMonth(date: MuttiDate) {
		const parts = this.format.formatToParts(date.date);
		const month = parts.find((part) => part.type === "month");
		invariant(month);

		return month.value;
	}

	public getYear(date: MuttiDate) {
		return date.year;
	}
}

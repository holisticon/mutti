import type { ComplexAttributeConverter } from "lit";

/** @example "2022-07-17" */
export type DateString = string;
/** Date representation in milliseconds. */
type DateMS = number;

/** A date representation that is customized for date operations on the timeline. */
export class MuttiDate {
	private static readonly millisecondsPerDay: DateMS = 1000 * 60 * 60 * 24;
	static readonly now = new MuttiDate();

	private dateMS: DateMS;
	public readonly date: Date;
	public readonly year: number;
	public readonly month: number;
	public readonly day: number;

	constructor(date?: DateString | DateMS) {
		this.date = date ? new Date(date) : new Date();
		this.assertValidDate(this.date, date ?? "Now");

		this.dateMS = this.date.getTime();
		this.year = this.date.getFullYear();
		this.month = this.date.getMonth() + 1;
		this.day = this.date.getDate();
	}

	static from(date: MuttiDate, days: number): MuttiDate {
		const time = date.dateMS + days * MuttiDate.millisecondsPerDay;
		return new MuttiDate(time);
	}

	private assertValidDate(
		date: Date,
		dateString: DateString | DateMS
	): asserts date {
		if (isNaN(date.getTime()))
			throw new TypeError(`${dateString} cannot be converted to a valid date.`);
	}

	public get nextMonth(): MuttiDate {
		const month = this.month < 12 ? this.month + 1 : 1;
		const year = this.month < 12 ? this.year : this.year + 1;
		return new MuttiDate(`${year}-${this.withPrefixedZero(month)}-01`);
	}

	public get nextYear(): MuttiDate {
		return new MuttiDate(`${this.year + 1}-01-01`);
	}

	public get previousMonth(): MuttiDate {
		if (!this.isStartOfMonth) {
			return new MuttiDate(
				`${this.year}-${this.withPrefixedZero(this.month)}-01`
			);
		}

		const month = this.month > 1 ? this.month - 1 : 12;
		const year = this.month > 1 ? this.year : this.year - 1;
		return new MuttiDate(`${year}-${this.withPrefixedZero(month)}-01`);
	}

	public get previousYear(): MuttiDate {
		if (this.isStartOfYear) {
			return new MuttiDate(`${this.year - 1}-01-01`);
		}

		return new MuttiDate(`${this.year}-01-01`);
	}

	public getDaysUntil(day: MuttiDate): number {
		const days = (day.dateMS - this.dateMS) / MuttiDate.millisecondsPerDay;
		return days < 0 ? Math.ceil(days) : Math.round(days);
	}

	public isLaterOrSameThan(date: MuttiDate): boolean {
		return this.dateMS >= date.dateMS;
	}

	public isEarlierOrSameThan(date: MuttiDate): boolean {
		return this.dateMS <= date.dateMS;
	}

	public isWithinDays(start: MuttiDate, end: MuttiDate): boolean {
		return this.isLaterOrSameThan(start) && this.isEarlierOrSameThan(end);
	}

	public get isStartOfMonth(): boolean {
		return this.day === 1;
	}

	public get isStartOfYear(): boolean {
		return this.month === 1 && this.day === 1;
	}

	public toString(): string {
		return `${this.year}-${this.withPrefixedZero(
			this.month
		)}-${this.withPrefixedZero(this.day)}`;
	}

	private withPrefixedZero(number: number): string {
		return (number < 10 ? "0" : "") + number;
	}

	static converter: ComplexAttributeConverter<MuttiDate> = {
		fromAttribute(value) {
			return value ? new MuttiDate(value) : new MuttiDate();
		},
		toAttribute(value) {
			return value.toString();
		},
	};
}

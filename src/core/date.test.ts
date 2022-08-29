import { DateString, MuttiDate } from "./date";
import { buildDate } from "../test-utils/builder";

describe("MuttiDate", () => {
	it("should throw an error if constructed with an invalid date-string", () => {
		const call = () => new MuttiDate("22-01-01");

		expect(call).toThrowError(/cannot be parsed as a date/);
	});

	describe("getDaysUntil", () => {
		const cases: [date: DateString, until: DateString, days: number][] = [
			["2022-04-15", "2022-04-16", 1],
			["2022-04-15", "2022-04-14", -1],
			["2022-04-15", "2022-04-15", 0],
		];

		it.each(cases)(
			"should return %n days for %s until %s",
			(date, until, days) => {
				expect(new MuttiDate(date).getDaysUntil(new MuttiDate(until))).toBe(
					days
				);
			}
		);
	});

	describe("isWithinDays", () => {
		it("should return true when the actual date is the start or end date", () => {
			const date = buildDate();
			const start = MuttiDate.from(date, -10);
			const end = MuttiDate.from(date, 10);

			expect(date.isWithinDays(date, end)).toBe(true);
			expect(date.isWithinDays(start, date)).toBe(true);
		});

		it("should return true if the actual date is between the start and end date", () => {
			const date = buildDate();
			const start = MuttiDate.from(date, -10);
			const end = MuttiDate.from(date, 10);

			expect(date.isWithinDays(start, end)).toBe(true);
		});

		it("should return false if the actual date is before the start date", () => {
			const date = buildDate();
			const start = MuttiDate.from(date, 10);
			const end = MuttiDate.from(start, 10);

			expect(date.isWithinDays(start, end)).toBe(false);
		});

		it("should return false if the actual date is after the end date", () => {
			const date = buildDate();
			const end = MuttiDate.from(date, -10);
			const start = MuttiDate.from(end, -10);

			expect(date.isWithinDays(start, end)).toBe(false);
		});
	});

	describe("previousMonth", () => {
		it("should return the current month when in the middle of month", () => {
			// Similar to "previous" in a music control, which goes to the start if the song already started
			const date = new MuttiDate("2022-05-16");
			expect(date.previousMonth.toString()).toBe("2022-05-01");
		});

		it("should return the previous month when the date is the first day of a month", () => {
			const date = new MuttiDate("2022-05-01");
			expect(date.previousMonth.toString()).toBe("2022-04-01");
		});

		it("should return December of the last year when current date is in January", () => {
			const date = new MuttiDate("2022-01-01");
			expect(date.previousMonth.toString()).toBe("2021-12-01");
		});
	});

	describe("nextMonth", () => {
		it("should return the first day of the next month", () => {
			const date = new MuttiDate("2022-05-16");
			expect(date.nextMonth.toString()).toBe("2022-06-01");
		});

		it("should return January of the next year when current date is in December", () => {
			const date = new MuttiDate("2022-12-16");
			expect(date.nextMonth.toString()).toBe("2023-01-01");
		});
	});

	describe("previousYear", () => {
		it("should return the current year when in the middle of a year", () => {
			// Similar to "previous" in a music control, which goes to the start if the song already started
			const date = new MuttiDate("2022-08-01");
			expect(date.previousYear.toString()).toBe("2022-01-01");
		});

		it("should return the previous year when the date is the first day of a year", () => {
			const date = new MuttiDate("2022-01-01");
			expect(date.previousYear.toString()).toBe("2021-01-01");
		});
	});

	describe("nextYear", () => {
		it("should return the first day of the next year", () => {
			const date = new MuttiDate("2022-05-16");
			expect(date.nextYear.toString()).toBe("2023-01-01");
		});
	});
});

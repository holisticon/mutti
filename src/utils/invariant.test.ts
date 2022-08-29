import { invariant } from "./invariant.js";

describe("invariant", () => {
	it("should not throw an error if the condition is truthy", () => {
		const truthy = [1, -1, true, {}, [], Symbol(), "hi"];
		expect.assertions(truthy.length);

		truthy
			.map((value) => () => invariant(value))
			.forEach((call) => expect(call).not.toThrowError());
	});

	it("should throw an error if the condition is falsy", () => {
		const falsy = [undefined, null, false, +0, -0, NaN, ""];
		expect.assertions(falsy.length);

		falsy
			.map((value) => () => invariant(value))
			.forEach((call) => expect(call).toThrowError());
	});

	it("should include a default message if the invariant throws without a message argument", () => {
		const call = () => invariant(false);

		expect(call).toThrowError("Invariant Failed");
	});

	it("should include a provided message if the invariant throws", () => {
		const call = () => invariant(false, "Custom Message");

		expect(call).toThrowError("Invariant Failed: Custom Message");
	});
});

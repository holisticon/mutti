import "@testing-library/jest-dom";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace jest {
		interface Matchers<R> {
			/**
			 * Checks a received element or its shadowRoot (if exists) for a slot element
			 * that matches the given name. Matches for a slot with no name, if no name is provided.
			 *
			 * **Note:** Checking the visibility of a slotted element provides false positives with jest-dom.
			 * A custom element might contain no slot and the passed children would still be considered visible,
			 * because jest-dom does not check for matching slots. Therefore, assert that
			 * expected slots are rendered by the custom element instead.
			 */
			toHaveSlot(name?: string | null): R;
		}
	}
}

expect.extend({
	toHaveSlot(
		received: HTMLElement,
		name: string | null = null
	): jest.CustomMatcherResult {
		const slots = (
			received.shadowRoot ?? received
		).querySelectorAll<HTMLSlotElement>("slot");

		if (slots.length === 0) {
			return {
				pass: false,
				message: () => `${received} does not contain any slot tags.`,
			};
		}

		let found = false;
		for (const slot of Array.from(slots)) {
			if (found && name === slot.getAttribute("name")) {
				return {
					pass: false,
					message: () => `${received} contains multiple matching slots.`,
				};
			}
			found = found || name === slot.getAttribute("name");
		}

		return {
			pass: found,
			message: () =>
				found
					? "Matching slot found."
					: `${received} does not contain a matching slot tag.`,
		};
	},
});

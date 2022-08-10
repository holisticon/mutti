import { test as base } from "@playwright/test";
import type { Track } from "./data.js";
export { expect } from "@playwright/test";
export type { Locator, Page } from "@playwright/test";

// Function is defined in 'index.html' to avoid problems with importing Lit in Playwright.
declare global {
	function renderTimeline(tracks: Track[]): void;
	function clearTimeline(): void;
}

interface Fixture {
	render(tracks: Track[]): Promise<void>;
}

export const test = base.extend<Fixture>({
	render: async ({ page }, use) => {
		const render: Fixture["render"] = async (tracks) => {
			await page.evaluate(async (tracks) => {
				window.renderTimeline(tracks);
			}, tracks);
		};

		await page.goto("/test");
		await use(render);
		await page.evaluate(async () => {
			window.clearTimeline();
		});
	},
});

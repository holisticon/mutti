import { buildTrack, listOf } from "../data.js";
import { test, expect } from "../fixture.js";

test("Basic Test", async ({ page, render }) => {
	const tracks = listOf(buildTrack);
	await render(tracks);

	const title = page.locator(`text=${tracks[0]?.children}`);
	await expect(title).toBeVisible();
	await page.pause();
});

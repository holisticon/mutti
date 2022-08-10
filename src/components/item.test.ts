import { render, html } from "../test-utils/render";
import type { MuttiItemElement } from "./item";
import "./item";

describe("<mutti-item>", () => {
	it("should set its slot property to item", async () => {
		const ele = await render<MuttiItemElement>(html`<mutti-item></mutti-item>`);

		expect(ele.slot).toBe("item");
	});
});

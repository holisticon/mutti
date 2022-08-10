import { render, html } from "../test-utils/render";
import type { MuttiItemElement } from "./item";
import "./item";

describe("<mutti-item>", () => {
	it("should set its slot property to item", async () => {
		const { element } = await render<MuttiItemElement>(
			html`<mutti-item></mutti-item>`
		);

		expect(element).toHaveAttribute("slot", "item");
	});

	it("should render a generic slot to insert children", async () => {
		const { element } = await render<MuttiItemElement>(
			html`<mutti-item></mutti-item>`
		);

		expect(element).toHaveSlot();
	});
});

import { render, html } from "../test-utils/render";
import type { MuttiLabelElement } from "./label";
import "./label";

describe("<mutti-label>", () => {
	it("should set its slot property to label", async () => {
		const { element } = await render<MuttiLabelElement>(
			html`<mutti-label></mutti-label>`
		);

		expect(element).toHaveAttribute("slot", "label");
	});

	it("should render a generic slot to insert children", async () => {
		const { element } = await render<MuttiLabelElement>(
			html`<mutti-label></mutti-label>`
		);

		expect(element).toHaveSlot();
	});
});

import { html, render } from "../test-utils/render";
import type { MuttiTrackElement } from "./track";
import "./track";

describe("<mutti-track>", () => {
	it("should set its slot property to track", async () => {
		const { element } = await render<MuttiTrackElement>(
			html`<mutti-track></mutti-track>`
		);

		expect(element).toHaveAttribute("slot", "track");
	});

	it("should render a slot for labels and items", async () => {
		const { element } = await render<MuttiTrackElement>(
			html`<mutti-track></mutti-track>`
		);
		expect(element).toHaveSlot("label");
		expect(element).toHaveSlot("item");
		expect(element).toHaveSlot("static-item");
	});
});

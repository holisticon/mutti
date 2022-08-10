import { render, html } from "../test-utils/render";
import type { MuttiTimelineElement } from "./timeline";
import "./timeline";

describe("<mutti-timeline>", () => {
	it("should render a slot for tracks", async () => {
		const { element } = await render<MuttiTimelineElement>(
			html`<mutti-timeline></mutti-timeline>`
		);

		expect(element).toHaveSlot("track");
	});
});

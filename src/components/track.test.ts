import { screen } from "@testing-library/dom";
import { html, render } from "../test-utils/render";
import type { MuttiTrackElement } from "./track";
import "./track";
import "./label";

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

	it("should label itself with a containing <mutti-label>", async () => {
		const { element } = await render<MuttiTrackElement>(
			html`<mutti-track><mutti-label>Test</mutti-label></mutti-track>`
		);

		const label = screen.getByText("Test");

		expect(label.id).toBe("mutti-label-0");
		expect(element.getAttribute("aria-labelledby")).toBe(label.id);
	});

	it("should preserve the id of its label if exists", async () => {
		const { element } = await render<MuttiTrackElement>(
			html`<mutti-track><mutti-label id="test">Test</mutti-label></mutti-track>`
		);

		const label = screen.getByText("Test");

		expect(label.id).toBe("test");
		expect(element.getAttribute("aria-labelledby")).toBe(label.id);
	});
});

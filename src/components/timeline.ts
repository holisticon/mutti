import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("mutti-timeline")
export class MuttiTimelineElement extends LitElement {
	protected override render(): TemplateResult {
		return html`<slot name="track"></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-timeline": MuttiTimelineElement;
	}
}

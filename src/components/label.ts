import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("mutti-label")
export class MuttiLabelElement extends LitElement {
	override slot = "label";

	protected override render(): TemplateResult {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-label": MuttiLabelElement;
	}
}

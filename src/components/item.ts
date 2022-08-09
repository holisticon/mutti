import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("mutti-item")
export class MuttiItemElement extends LitElement {
	override slot = "item";

	protected override render(): TemplateResult {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-item": MuttiItemElement;
	}
}

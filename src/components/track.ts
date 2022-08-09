import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("mutti-track")
export class MuttiTrackElement extends LitElement {
	override slot = "track";

	protected override render(): TemplateResult {
		return html`
			<div class="label-container"><slot name="label"></slot></div>
			<div class="items-container"><slot name="item"></slot></div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-track": MuttiTrackElement;
	}
}

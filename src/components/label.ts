import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

const styles = css`
	:host {
		box-sizing: border-box;
		display: block;
		width: 100%;
		height: 100%;
	}
`;

@customElement("mutti-label")
export class MuttiLabelElement extends LitElement {
	static override styles = styles;

	readonly role = "rowheader";
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

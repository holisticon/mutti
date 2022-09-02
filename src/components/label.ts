import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

const styles = css`
	:host {
		box-sizing: border-box;
		display: block;
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 2;
	}
`;

@customElement("mutti-label")
export class MuttiLabelElement extends LitElement {
	static override styles = styles;

	@property({ reflect: true }) readonly role = "rowheader";
	@property({ reflect: true }) override slot = "label";

	protected override render(): TemplateResult {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-label": MuttiLabelElement;
	}
}

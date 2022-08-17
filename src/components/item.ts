import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cameraProp } from "../controllers/camera-controller.js";
import { ItemInteractionsController } from "../controllers/item-interactions-controller.js";
import { MuttiDate } from "../core/date.js";
import { ItemFocusEvent } from "../core/events.js";
import { varX } from "../core/properties.js";

/** Custom CSS property names that are related to items. */
export const itemProp = {
	scale: "--mutti-item-scale",
	length: "--mutti-item-length",
	nowOffset: "--mutti-item-now-offset",
	subTrack: "--mutti-item-sub-track",
};

const styles = css`
	:host {
		box-sizing: border-box;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;

		user-select: none;
		-webkit-tap-highlight-color: transparent;
		-webkit-user-select: none;

		position: absolute;
		height: calc(100% * ${varX(itemProp.scale)});
		width: calc(${varX(cameraProp.dayWidth)} * ${varX(itemProp.length)});
		transform: translateX(
			calc(${varX(cameraProp.dayWidth)} * ${varX(itemProp.nowOffset)})
		);
		grid-row-start: ${varX(itemProp.subTrack)};
		grid-row-end: ${varX(itemProp.subTrack)};
	}
`;

@customElement("mutti-item")
export class MuttiItemElement extends LitElement {
	static override styles = styles;
	private controller = new ItemInteractionsController(this);

	readonly role = "gridcell";
	override slot = "item";
	override tabIndex = 0;

	@property({ type: Number }) scale = 1;
	@property({ converter: MuttiDate.converter }) start = MuttiDate.now;
	@property({ converter: MuttiDate.converter }) end = MuttiDate.from(
		this.start,
		7
	);
	@property({ type: Number, attribute: false }) subTrack = 1;

	override focus(): void {
		const shouldContinue = this.dispatchEvent(
			new ItemFocusEvent(this.start, this.end)
		);
		if (shouldContinue) super.focus({ preventScroll: true });
	}

	protected override willUpdate(changedProperties: PropertyValues): void {
		if (changedProperties.has("subTrack")) {
			this.style.setProperty(itemProp.subTrack, this.subTrack.toString());
		}
		if (changedProperties.has("scale")) {
			this.style.setProperty(itemProp.scale, this.scale.toString());
		}
		if (changedProperties.has("start") || changedProperties.has("end")) {
			this.style.setProperty(
				itemProp.length,
				this.start.getDaysUntil(this.end).toString()
			);
		}
		if (changedProperties.has("start")) {
			this.style.setProperty(
				itemProp.nowOffset,
				this.start.getDaysFromNow().toString()
			);
		}
	}

	protected override render(): TemplateResult {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-item": MuttiItemElement;
	}
}

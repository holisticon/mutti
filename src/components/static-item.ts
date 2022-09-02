import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cameraProp } from "../controllers/camera-controller.js";
import { MuttiDate } from "../core/date.js";
import { varX } from "../core/properties.js";

/** Custom CSS property names that are related to static items. */
export const staticItemProp = {
	length: "--mutti-static-item-length",
	nowOffset: "--mutti-static-item-now-offset",
};

const styles = css`
	:host {
		box-sizing: border-box;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;

		pointer-events: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		-webkit-user-select: none;

		position: absolute;
		height: 100%;
		width: calc(${varX(cameraProp.dayWidth)} * ${varX(staticItemProp.length)});
		transform: translateX(
			calc(${varX(cameraProp.dayWidth)} * ${varX(staticItemProp.nowOffset)})
		);
		grid-row: 1 / -1; // Spans the whole track
	}
`;

/**
 * Static items are special items, which do not participate in collision avoidance
 * and are not interactive for the user.
 *
 * Their default styling render them behind other `mutti-item`s.
 */
@customElement("mutti-static-item")
export class MuttiStaticItemElement extends LitElement {
	static override styles = styles;

	@property({ reflect: true }) readonly role = "gridcell";
	@property({ reflect: true }) override slot = "static-item";

	@property({ converter: MuttiDate.converter }) start = MuttiDate.now;
	@property({ converter: MuttiDate.converter }) end = MuttiDate.from(
		this.start,
		7
	);

	protected override willUpdate(changedProperties: PropertyValues): void {
		if (changedProperties.has("start") || changedProperties.has("end")) {
			this.style.setProperty(
				staticItemProp.length,
				this.start.getDaysUntil(this.end).toString()
			);
		}
		if (changedProperties.has("start")) {
			this.style.setProperty(
				staticItemProp.nowOffset,
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
		"mutti-static-item": MuttiStaticItemElement;
	}
}

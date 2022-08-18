import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cameraProp } from "../controllers/camera-controller.js";
import { ItemInteractionsController } from "../controllers/item-interactions-controller.js";
import {
	PointerController,
	PointerHandler,
} from "../controllers/pointer-controller.js";
import { MuttiDate } from "../core/date.js";
import { ItemChangeEvent, ItemFocusEvent } from "../core/events.js";
import { varX } from "../core/properties.js";

/** Custom CSS property names that are related to items. */
export const itemProp = {
	scale: "--mutti-item-scale",
	length: "--mutti-item-length",
	nowOffset: "--mutti-item-now-offset",
	subTrack: "--mutti-item-sub-track",
	dragOffset: "--mutti-item-drag-offset",
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
			calc(
				${varX(itemProp.dragOffset)} +
					(${varX(cameraProp.dayWidth)} * ${varX(itemProp.nowOffset)})
			)
		);
		grid-row-start: ${varX(itemProp.subTrack)};
		grid-row-end: ${varX(itemProp.subTrack)};
	}
`;

@customElement("mutti-item")
export class MuttiItemElement extends LitElement {
	static override styles = styles;
	private interactionController: ItemInteractionsController;
	private pointerController: PointerController;

	readonly role = "gridcell";
	override slot = "item";
	override tabIndex = 0;

	@state() dragOffset = 0;

	@property({ type: Number }) scale = 1;
	@property({ converter: MuttiDate.converter, reflect: true }) start =
		MuttiDate.now;
	@property({ converter: MuttiDate.converter, reflect: true }) end =
		MuttiDate.from(this.start, 7);
	@property({ type: Number, attribute: false }) subTrack = 1;

	constructor() {
		super();
		this.interactionController = new ItemInteractionsController(this);
		this.pointerController = new PointerController(this, {
			disabled: true,
			stopPropagation: true,
			moveHandler: this.handleMove,
			doneHandler: this.handleMoveDone,
		});

		this.addEventListener(
			"focus",
			() => (this.pointerController.disabled = false)
		);
		this.addEventListener(
			"blur",
			() => (this.pointerController.disabled = true)
		);
	}

	private handleMove: PointerHandler = (_, delta) => {
		this.dragOffset += delta.x;
	};

	private handleMoveDone: PointerHandler = () => {
		// TODO: Parsing the value from CSS properties feels a bit "hacky" (but is quite fast).
		// We should consider upgrading the backbone of the timeline with a lit context
		// to pass global state around. However, it should not introduce additional
		// lit renders when e.g. the offset updates.
		const dayWidth = parseFloat(
			getComputedStyle(this).getPropertyValue(cameraProp.dayWidth)
		);
		const newStart = MuttiDate.from(this.start, this.dragOffset / dayWidth);
		const newEnd = MuttiDate.from(this.end, this.dragOffset / dayWidth);
		this.dragOffset = 0;

		const shouldContinue = this.dispatchEvent(
			new ItemChangeEvent(newStart, newEnd)
		);

		if (!shouldContinue) return;
		this.start = newStart;
		this.end = newEnd;
	};

	override focus(): void {
		const shouldContinue = this.dispatchEvent(
			new ItemFocusEvent(this.start, this.end)
		);
		if (shouldContinue) super.focus({ preventScroll: true });
	}

	protected override willUpdate(changedProperties: PropertyValues): void {
		if (changedProperties.has("dragOffset")) {
			this.style.setProperty(itemProp.dragOffset, `${this.dragOffset}px`);
		}
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

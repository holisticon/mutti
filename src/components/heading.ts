import type { PropertyValues, TemplateResult } from "lit";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { cameraProp } from "../controllers/camera-controller.js";
import { MuttiDateFormatter } from "../core/date-formatter.js";
import { MuttiDate } from "../core/date.js";
import { varX, themeProp } from "../core/properties.js";

/** Custom CSS property names that are related to the heading. */
export const headingProp = {
	labelOffset: "--mutti-label-offset",
};

const styles = css`
	:host {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	::slotted {
		flex-grow: 2;
	}

	.today {
		position: absolute;
		background-color: ${varX(themeProp.todayColor, "red")};
		width: 2px;
		height: 100%;
		transform: translateX(${varX(cameraProp.offset)});
		will-change: transform;
	}

	.date-container {
		position: absolute;
		inset: 0;
		transform: translateX(${varX(cameraProp.offset)});
		will-change: transform;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	.date-label {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute; // Required for each month to not consume any layout.
		line-height: 1;
		border-inline-start: 1px solid lightgrey;
		padding-inline-start: 4px;
		transform: translateX(
			calc(${varX(headingProp.labelOffset)} * ${varX(cameraProp.dayWidth)})
		);
		will-change: transform;
	}

	.month {
		position: absolute;
		top: 1em;
	}

	.spacer {
		flex-shrink: 0;
		height: calc(2em + 6px);
		border-bottom: 1px solid darkgray;
	}
`;

interface UpdateTriggers {
	dayWidth: number;
	offset: number;
	viewportWidth: number;
}

@customElement("mutti-heading")
class MuttiHeadingElement extends LitElement {
	static override styles = styles;
	private format!: MuttiDateFormatter;
	private visibleMonths: MuttiDate[] = [];
	private populateTriggers?: UpdateTriggers;

	@property({ type: Boolean }) yearOnly = false;
	@property({ type: Number, attribute: false }) cameraDayWidth = 0;
	@property({ type: Number, attribute: false }) cameraOffset = 0;
	@property({ type: Number, attribute: false }) cameraViewportWidth = 0;

	override connectedCallback(): void {
		super.connectedCallback?.();
		this.format = new MuttiDateFormatter(this.lang);
	}

	protected override shouldUpdate(changedProperties: PropertyValues): boolean {
		// Update anyway if we cannot optimize based on previous values
		if (!this.populateTriggers) return true;

		// Wait until roughly a month/year of difference is created by panning or resizing
		// before repopulating the visible month.
		const differenceToSkip =
			25 * this.cameraDayWidth * (this.yearOnly ? 12 : 1);

		if (changedProperties.has("cameraOffset")) {
			const offsetDiff = Math.abs(
				this.populateTriggers.offset - this.cameraOffset
			);
			return offsetDiff >= differenceToSkip;
		}
		if (changedProperties.has("cameraViewportWidth")) {
			const widthDiff = Math.abs(
				this.populateTriggers.viewportWidth - this.cameraViewportWidth
			);
			return widthDiff >= differenceToSkip;
		}

		return true;
	}

	protected override willUpdate(changedProperties: PropertyValues): void {
		if (
			changedProperties.has("cameraDayWidth") ||
			changedProperties.has("cameraOffset") ||
			changedProperties.has("cameraViewportWidth")
		) {
			this.populateTriggers = {
				dayWidth: this.cameraDayWidth,
				offset: this.cameraOffset,
				viewportWidth: this.cameraViewportWidth,
			};
			this.visibleMonths = this.populateVisibleMonths(
				this.yearOnly,
				this.populateTriggers
			);
		}
	}

	private populateVisibleMonths(
		skipMonths: boolean,
		triggers: UpdateTriggers
	): MuttiDate[] {
		// How the algorithm works:
		// The offset is based on the left side of the viewport. Offset 0 is the
		// left edge with a positive offset moving today (always offset 0) to the right.
		// First a month close to the left of the viewport edge is identified with some
		// margin (200) for smoother panning visuals.
		// Afterwards the algorithm iterates through the month (or years only if flagged)
		// and collects them in a list, until the iterating month is outside of the
		// viewport (right side) with some margin (200) for smoother panning visuals.

		const months: MuttiDate[] = [];
		const zeroMonth = MuttiDate.from(
			MuttiDate.now,
			Math.floor((triggers.offset + 200) / triggers.dayWidth) * -1
		).previousMonth;

		const reachedDelimiter = (month: MuttiDate) => {
			const zeroOffset = Math.abs(
				month.getDaysUntil(zeroMonth) * triggers.dayWidth
			);
			// Overshoot by 200 (200 for left edge + 200 for right edge) for smoother panning visuals
			return zeroOffset > triggers.viewportWidth + 400;
		};

		let indexMonth = zeroMonth;
		do {
			if (!skipMonths || indexMonth.isStartOfYear) {
				// Logical implication. For yearOnly, only full years will be rendered.
				months.push(indexMonth);
			}
			indexMonth = skipMonths ? indexMonth.nextYear : indexMonth.nextMonth;
		} while (!reachedDelimiter(indexMonth));

		return months;
	}

	private renderDate(date: MuttiDate): TemplateResult {
		const styles = styleMap({
			[headingProp.labelOffset]: date.getDaysFromNow().toString(),
		});
		return html`
			<div class="date-label" style=${styles}>
				${!date.isStartOfYear
					? nothing
					: html`<span>${this.format.getYear(date)}</span>`}
				${this.yearOnly
					? nothing
					: html`<span class="month">${this.format.getMonth(date)}</span>`}
			</div>
		`;
	}

	protected override render(): TemplateResult {
		return html`
			<div class="spacer"></div>
			<div class="date-container" aria-hidden="true">
				${repeat(
					this.visibleMonths,
					(date) => date.toString(),
					(date) => this.renderDate(date)
				)}
			</div>
			<slot></slot>
			<div class="today" aria-label="Today" title="Today"></div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-heading": MuttiHeadingElement;
	}
}

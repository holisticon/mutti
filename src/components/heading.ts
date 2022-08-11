import { css, html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import { styleMap } from "lit/directives/style-map.js";
import { cameraProp } from "../controllers/camera-controller.js";
import { MuttiDateFormatter } from "../core/date-formatter.js";
import { MuttiDate } from "../core/date.js";
import { varX } from "../core/properties.js";

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

		width: 100%;
	}

	::slotted {
		flex-grow: 2;
	}

	.today {
		position: absolute;
		background-color: red;
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

	.placed {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute; // Required for each month to not consume any layout.
		line-height: 1;
		padding-left: 4px;
		transform: translateX(
			calc(${varX(headingProp.labelOffset)} * ${varX(cameraProp.dayWidth)})
		);
		will-change: transform;
	}

	.month {
		position: absolute;
		top: 1em;
	}

	.with-line {
		border-left: 1px solid lightgrey;
	}

	.spacer {
		flex-shrink: 0;
		height: calc(2em + 6px);
		border-bottom: 1px solid darkgray;
	}
`;

@customElement("mutti-heading")
class MuttiHeadingElement extends LitElement {
	static override styles = styles;
	private _format = new MuttiDateFormatter();

	@property({ type: Boolean }) yearOnly = false;

	private renderDate(date: MuttiDate) {
		if (this.yearOnly && !date.isStartOfYear) return nothing;

		const styles = styleMap({
			[headingProp.labelOffset]: date.getDaysFromNow().toString(),
		});
		const classes = classMap({
			placed: true,
			"with-line": !this.yearOnly || date.isStartOfYear, // logical implication
		});
		const result = html`
			<div class=${classes} style=${styles}>
				${!date.isStartOfYear
					? nothing
					: html` <span>${this._format.getYear(date)}</span> `}
				${this.yearOnly
					? nothing
					: html` <span class="month">${this._format.getMonth(date)}</span> `}
			</div>
		`;
		return result;
	}

	protected override render(): TemplateResult {
		let previousMonth = MuttiDate.now.isStartOfMonth
			? MuttiDate.now
			: MuttiDate.now.previousMonth;
		let nextMonth = MuttiDate.now.nextMonth;
		return html`
			<div class="spacer"></div>
			<div class="date-container" aria-hidden="true">
				${map(range(100), () => {
					const res = this.renderDate(previousMonth);
					previousMonth = previousMonth.previousMonth;
					return res;
				})}
				${map(range(100), () => {
					const res = this.renderDate(nextMonth);
					nextMonth = nextMonth.nextMonth;
					return res;
				})}
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

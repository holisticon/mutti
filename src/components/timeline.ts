import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import {
	CameraController,
	cameraProp,
} from "../controllers/camera-controller.js";
import { varX, themeProp } from "../core/properties.js";

const styles = css`
	:host {
		box-sizing: border-box;
		touch-action: none;

		position: relative;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.today {
		position: absolute;
		background-color: ${varX(themeProp.todayColor, "red")};
		width: 2px;
		height: 100%;
		transform: translateX(${varX(cameraProp.offset)});
		will-change: transform;
	}
`;

@customElement("mutti-timeline")
export class MuttiTimelineElement extends LitElement {
	static override styles = styles;

	readonly role = "grid";

	private cameraController = new CameraController(this, {
		initialDayOffset: 100,
	});

	protected override render(): TemplateResult {
		return html`
			<slot name="track"></slot>
			<div class="today" aria-label="Today" title="Today"></div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-timeline": MuttiTimelineElement;
	}
}

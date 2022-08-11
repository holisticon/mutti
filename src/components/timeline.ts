import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
	CameraController,
	ZoomDetailLevel,
} from "../controllers/camera-controller.js";
import "./heading.js";

const styles = css`
	:host {
		box-sizing: border-box;
		display: block;
		touch-action: none;
	}

	.track-container {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		overflow-y: auto;
	}
`;

@customElement("mutti-timeline")
export class MuttiTimelineElement extends LitElement {
	static override styles = styles;

	readonly role = "grid";

	@property()
	override lang = document.documentElement.lang || navigator.language;

	private cameraController = new CameraController(this, {
		initialDayOffset: 100,
	});

	protected override render(): TemplateResult {
		return html`
			<mutti-heading
				.lang=${this.lang}
				part="heading"
				?yearOnly=${this.cameraController.zoomDetail === ZoomDetailLevel.Year}
			>
				<div class="track-container">
					<slot name="track"></slot>
				</div>
			</mutti-heading>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-timeline": MuttiTimelineElement;
	}
}

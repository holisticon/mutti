import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
	CameraController,
	ZoomDetailLevel,
} from "../controllers/camera-controller.js";
import { FocusChangeEvent } from "../core/events.js";
import "./heading.js";
import { MuttiTrackElement } from "./track.js";

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
	private cameraController: CameraController;

	@property()
	override lang = document.documentElement.lang || navigator.language;
	@property({ type: Number }) viewportPadding = 100;

	constructor() {
		super();
		this.cameraController = new CameraController(this, {
			initialDayOffset: 100,
		});
		this.addEventListener(FocusChangeEvent.type, this.handleFocusChange);
	}

	protected override willUpdate(changedProperties: PropertyValues): void {
		if (changedProperties.has("viewportPadding")) {
			this.cameraController.updateConfig({
				viewportPadding: this.viewportPadding,
			});
		}
	}

	private handleFocusChange = (e: FocusChangeEvent) => {
		// The <mutti-track> that first handled the event is not able to go further
		// up or down, so the event should be passed to the previous/next track.
		const track = e.composedPath().find(this.isMuttiTrack);
		let next: Element | null | undefined;
		do {
			if (e.where === "up") next = (next ?? track)?.previousElementSibling;
			else next = (next ?? track)?.nextElementSibling;
		} while (next && !this.isMuttiTrack(next));

		next?.focusOnRelevantSubTrack(e);
	};

	private isMuttiTrack(value: unknown): value is MuttiTrackElement {
		return value instanceof MuttiTrackElement;
	}

	protected override render(): TemplateResult {
		return html`
			<mutti-heading
				.lang=${this.lang}
				.cameraDayWidth=${this.cameraController.dayWidth}
				.cameraOffset=${this.cameraController.offset}
				.cameraViewportWidth=${this.cameraController.viewport.width}
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

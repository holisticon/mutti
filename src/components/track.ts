import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { cameraProp } from "../controllers/camera-controller.js";
import { varX, themeProp } from "../core/properties.js";
import { MuttiItemElement } from "./item.js";

/** Custom CSS property names that are related to tracks. */
const trackProp = {
	subTracks: "--mutti-sub-tracks",
};

const styles = css`
	:host {
		box-sizing: border-box;
		position: relative;
		width: 100%;
		height: max-content;
	}

	.items-container {
		box-sizing: border-box;
		display: grid;
		grid-template-rows: repeat(${varX(trackProp.subTracks, "1")}, 100px);
		align-items: end;
		gap: ${varX(themeProp.itemGap, "4px")};
		padding: ${varX(themeProp.itemGap, "4px")} 0;
		width: 100%;
		transform: translateX(${varX(cameraProp.offset)});
		will-change: transform;
	}
`;

@customElement("mutti-track")
export class MuttiTrackElement extends LitElement {
	static override styles = styles;

	readonly role = "row";
	override slot = "track";

	protected override firstUpdated(): void {
		const children = Array.from(this.children);

		const items = children.filter<MuttiItemElement>(
			(c): c is MuttiItemElement => c instanceof MuttiItemElement
		);
		this.collisionAvoidance(items);
	}

	private collisionAvoidance(items: MuttiItemElement[]) {
		const subTracks: MuttiItemElement[][] = [];
		for (const item of items) {
			const added = this.addToFittingTrack(item, subTracks);
			if (!added) {
				subTracks.push([item]);
			}
		}

		if (subTracks.length === 0) return;

		this.style.setProperty(trackProp.subTracks, `${subTracks.length}`);
		subTracks.forEach((track, index) => {
			for (const item of track) {
				item.subTrack = index + 1;
			}
		});
	}

	private addToFittingTrack(
		item: MuttiItemElement,
		tracks: MuttiItemElement[][]
	): boolean {
		for (const track of tracks) {
			const isFitting = track.every((trackItem) => {
				const itemWithinTrackItem =
					item.start.isWithinDays(trackItem.start, trackItem.end) ||
					item.end.isWithinDays(trackItem.start, trackItem.end);
				const trackItemWithinItem =
					trackItem.start.isWithinDays(item.start, item.end) ||
					trackItem.end.isWithinDays(item.start, item.end);

				return !itemWithinTrackItem && !trackItemWithinItem;
			});
			if (isFitting) {
				track.push(item);
				return true;
			}
		}

		return false;
	}

	protected override render(): TemplateResult {
		return html`
			<slot name="label"></slot>
			<div class="items-container">
				<slot name="static-item"></slot>
				<slot name="item"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"mutti-track": MuttiTrackElement;
	}
}

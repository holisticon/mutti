import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { cameraProp } from "../controllers/camera-controller.js";
import { FocusChangeEvent } from "../core/events.js";
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
		grid-template-rows: repeat(${varX(trackProp.subTracks)}, 100px);
		align-items: end;
		gap: ${varX(themeProp.itemGap, "4px")};
		padding: ${varX(themeProp.itemGap, "4px")} 0;
		width: 100%;
		transform: translateX(${varX(cameraProp.offset)});
		will-change: transform;
	}
`;

type SubTracks = MuttiItemElement[][];
type ItemPosition = { subTrack: number; position: number };
type ItemPositionMap = Map<MuttiItemElement, ItemPosition>;

@customElement("mutti-track")
export class MuttiTrackElement extends LitElement {
	static override styles = styles;

	readonly role = "row";
	override slot = "track";

	private subTracks: SubTracks = [];
	private itemPositionMap: ItemPositionMap = new Map();

	constructor() {
		super();
		this.addEventListener(FocusChangeEvent.type, this.handleFocusChange);
	}

	protected override firstUpdated(): void {
		const children = Array.from(this.children);

		const items = children.filter(this.isMuttiItem);
		this.subTracks = this.orderItemsIntoSubTracks(items);
		this.applySubTrackInfoToElements(this.subTracks);
		this.fillPositionMap(this.itemPositionMap, this.subTracks);
	}

	/** Called by the <mutti-timeline> with delegated {@link FocusChangeEvent}s. */
	public focusOnRelevantSubTrack(e: FocusChangeEvent): void {
		const item = e.target;
		if (!this.isMuttiItem(item)) return;

		const track =
			(e.where === "down" ? this.subTracks.at(0) : this.subTracks.at(-1)) ?? [];
		const next = this.getClosestItemFromList(item, track);
		if (!next) return;

		this.scrollIntoView({ block: "center" });
		next.focus();
	}

	private handleFocusChange = (e: FocusChangeEvent) => {
		const item = e.target;
		if (!this.isMuttiItem(item)) return;

		const position = this.itemPositionMap.get(item);
		if (!position) {
			throw new Error("Item has not been mapped into a position!");
		}

		switch (e.where) {
			case "left": {
				e.stopPropagation();
				const next = this.subTracks[position.subTrack]?.[position.position - 1];
				next?.focus();
				return;
			}
			case "right": {
				e.stopPropagation();
				const next = this.subTracks[position.subTrack]?.[position.position + 1];
				next?.focus();
				return;
			}
			case "up": {
				const previousTrack = this.subTracks[position.subTrack - 1];
				if (!previousTrack) return; // Event will be delegated to the previous track by the timeline
				e.stopPropagation();
				const next = this.getClosestItemFromList(item, previousTrack);
				return next?.focus();
			}
			case "down": {
				const nextTrack = this.subTracks[position.subTrack + 1];
				if (!nextTrack) return; // Event will be delegated to the next track by the timeline
				e.stopPropagation();
				const next = this.getClosestItemFromList(item, nextTrack);
				return next?.focus();
			}
		}
	};

	private orderItemsIntoSubTracks(items: MuttiItemElement[]): SubTracks {
		const subTracks: SubTracks = [];
		for (const item of items) {
			let fits = false;
			for (const track of subTracks) {
				fits = this.isItemFittingIntoTrack(item, track);
				if (!fits) continue;
				track.push(item);
				break;
			}
			if (!fits) subTracks.push([item]);
		}

		for (const track of subTracks) {
			track.sort((a, b) => {
				const lessThan = a.start.isEarlierThan(b.start);
				const greaterThan = a.start.isLaterThan(b.start);
				if (lessThan) return -1;
				if (greaterThan) return 1;
				return 0;
			});
		}
		return subTracks;
	}

	private isItemFittingIntoTrack(
		item: MuttiItemElement,
		track: MuttiItemElement[]
	) {
		return track.every((trackItem) => {
			const itemWithinTrackItem =
				item.start.isWithinDays(trackItem.start, trackItem.end) ||
				item.end.isWithinDays(trackItem.start, trackItem.end);
			const trackItemWithinItem =
				trackItem.start.isWithinDays(item.start, item.end) ||
				trackItem.end.isWithinDays(item.start, item.end);

			return !itemWithinTrackItem && !trackItemWithinItem;
		});
	}

	private isMuttiItem(value: unknown): value is MuttiItemElement {
		return value instanceof MuttiItemElement;
	}

	private getClosestItemFromList(
		ref: MuttiItemElement,
		items: MuttiItemElement[]
	): MuttiItemElement | undefined {
		if (items.length === 0) return;

		const scoring = items.map((item) => {
			const startToStart = Math.abs(item.start.getDaysUntil(ref.start));
			const startToEnd = Math.abs(item.start.getDaysUntil(ref.end));
			const endToStart = Math.abs(item.end.getDaysUntil(ref.start));
			const endToEnd = Math.abs(item.end.getDaysUntil(ref.end));
			return (
				Math.min(startToStart, startToEnd) + Math.min(endToStart, endToEnd)
			);
		});
		const minIndex = scoring.indexOf(Math.min(...scoring));
		return items[minIndex];
	}

	private applySubTrackInfoToElements(subTracks: SubTracks) {
		this.style.setProperty(trackProp.subTracks, `${subTracks.length}`);
		subTracks.forEach((track, index) =>
			track.forEach((item) => (item.subTrack = index + 1))
		);
	}

	private fillPositionMap(map: ItemPositionMap, subTracks: SubTracks) {
		/* eslint-disable @typescript-eslint/no-non-null-assertion */
		for (let subTrack = 0; subTrack < subTracks.length; subTrack++) {
			for (
				let position = 0;
				position < subTracks[subTrack]!.length;
				position++
			) {
				const item = subTracks[subTrack]![position]!;
				map.set(item, { subTrack, position });
			}
		}
		/* eslint-enable @typescript-eslint/no-non-null-assertion */
	}

	protected override render(): TemplateResult {
		return html`
			<slot name="label"></slot>
			<div class="items-container">
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

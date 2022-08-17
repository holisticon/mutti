import type { MuttiDate } from "./date.js";

abstract class MuttiEvent extends Event {
	static match(_: Event): _ is MuttiEvent {
		throw new TypeError(
			"Static 'match' method must be implemented by each subclass."
		);
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		[ActionEvent.type]: ActionEvent;
		[DeleteEvent.type]: DeleteEvent;
		[FocusChangeEvent.type]: FocusChangeEvent;
		[ItemFocusEvent.type]: ItemFocusEvent;
	}
}

export class ActionEvent extends MuttiEvent {
	static type = "action" as const;

	constructor() {
		super(ActionEvent.type);
	}

	static override match(e: Event): e is ActionEvent {
		return e instanceof ActionEvent;
	}
}

export class DeleteEvent extends MuttiEvent {
	static type = "delete" as const;

	constructor() {
		super(DeleteEvent.type);
	}

	static override match(e: Event): e is DeleteEvent {
		return e instanceof DeleteEvent;
	}
}

export type FocusChangeLocation = "left" | "right" | "up" | "down";
export class FocusChangeEvent extends MuttiEvent {
	static type = "focuschange" as const;

	constructor(public readonly where: FocusChangeLocation) {
		super(FocusChangeEvent.type, { bubbles: true });
	}

	static override match(e: Event): e is FocusChangeEvent {
		return e instanceof FocusChangeEvent;
	}
}

/**
 * This event is dispatched before an item is focused via the keyboard.
 * If the event is cancelled, the item will not be focussed and will
 * not be moved into view.
 */
export class ItemFocusEvent extends MuttiEvent {
	static type = "itemfocus" as const;

	constructor(
		public readonly start: MuttiDate,
		public readonly end: MuttiDate
	) {
		super(ItemFocusEvent.type, { bubbles: true, cancelable: true });
	}

	static override match(e: Event): e is ItemFocusEvent {
		return e instanceof ItemFocusEvent;
	}
}

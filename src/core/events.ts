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

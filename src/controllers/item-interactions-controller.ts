import type { LitElement, ReactiveController } from "lit";
import { ActionEvent, DeleteEvent } from "../core/events.js";

export class ItemInteractionsController implements ReactiveController {
	constructor(private readonly host: LitElement) {
		host.addController(this);
	}

	hostConnected() {
		this.host.addEventListener("keydown", this.handleKeydown);
		this.host.addEventListener("dblclick", this.handleDoubleClick);
	}

	hostDisconnected() {
		this.host.removeEventListener("keydown", this.handleKeydown);
		this.host.removeEventListener("dblclick", this.handleDoubleClick);
	}

	private handleKeydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case "Enter":
				if (!e.repeat) this.action();
				break;
			case "Delete":
				if (!e.repeat) this.delete();
				break;
		}
	};

	private handleDoubleClick = () => {
		this.action();
	};

	private delete() {
		this.host.dispatchEvent(new DeleteEvent());
	}

	private action() {
		this.host.dispatchEvent(new ActionEvent());
	}
}

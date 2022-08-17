import type { LitElement, ReactiveController } from "lit";
import {
	ActionEvent,
	DeleteEvent,
	FocusChangeEvent,
	FocusChangeLocation,
} from "../core/events.js";

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
			case "ArrowLeft":
				e.preventDefault();
				this.changeFocus("left");
				break;
			case "ArrowRight":
				e.preventDefault();
				this.changeFocus("right");
				break;
			case "ArrowUp":
				e.preventDefault();
				this.changeFocus("up");
				break;
			case "ArrowDown":
				e.preventDefault();
				this.changeFocus("down");
				break;
		}
	};

	private handleDoubleClick = () => {
		this.action();
	};

	private changeFocus(where: FocusChangeLocation) {
		this.host.dispatchEvent(new FocusChangeEvent(where));
	}

	private delete() {
		this.host.dispatchEvent(new DeleteEvent());
	}

	private action() {
		this.host.dispatchEvent(new ActionEvent());
	}
}

import type { LitElement, ReactiveController } from "lit";
import { delta, equal, fromEvent, Point, zero } from "../core/point.js";

export type PointerHandler = (e: Event, delta: Point) => void;

export interface PointerControllerConfig {
	disabled?: boolean;
	stopPropagation?: boolean;
	startHandler: PointerHandler;
	moveHandler: PointerHandler;
	doneHandler: PointerHandler;
}

export class PointerController implements ReactiveController {
	private isPointerDown = false;
	private pointerPos = zero;
	private startingPos = this.pointerPos;

	public stopPropagation: boolean;
	public disabled: boolean;

	constructor(
		private readonly host: LitElement,
		private readonly config?: Partial<PointerControllerConfig>
	) {
		host.addController(this);
		this.stopPropagation = config?.stopPropagation ?? false;
		this.disabled = config?.disabled ?? false;
	}

	hostConnected() {
		this.host.addEventListener("pointerdown", this.handlePointerDown);
		this.host.addEventListener("pointermove", this.handlePointerMove);
		this.host.addEventListener("pointerup", this.handlePointerUp);
		this.host.addEventListener("pointerleave", this.handlePointerUp);
	}

	hostDisconnected() {
		this.host.removeEventListener("pointerdown", this.handlePointerDown);
		this.host.removeEventListener("pointermove", this.handlePointerMove);
		this.host.removeEventListener("pointerup", this.handlePointerUp);
		this.host.removeEventListener("pointerleave", this.handlePointerUp);
	}

	private handlePointerDown = (e: PointerEvent) => {
		if (this.isPointerDown || this.disabled) return;
		if (this.stopPropagation) e.stopPropagation();

		this.isPointerDown = true;

		this.startingPos = this.pointerPos = fromEvent(e);
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		this.config?.startHandler?.(e, zero);
	};

	private handlePointerUp = (e: PointerEvent) => {
		if (!this.isPointerDown || this.disabled) return;
		if (this.stopPropagation) e.stopPropagation();

		this.isPointerDown = false;
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);

		if (equal(fromEvent(e), this.startingPos)) return;
		this.config?.doneHandler?.(e, zero);
	};

	private handlePointerMove = (e: PointerEvent) => {
		if (!this.isPointerDown || this.disabled) return;
		if (this.stopPropagation) e.stopPropagation();

		const newP = fromEvent(e);
		const deltaP: Point = delta(this.pointerPos, newP);
		this.pointerPos = newP;
		this.config?.moveHandler?.(e, deltaP);
	};
}

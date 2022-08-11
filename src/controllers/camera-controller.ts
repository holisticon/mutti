import type { LitElement, ReactiveController } from "lit";
import { Camera, CameraConfig } from "../core/camera.js";

/** Custom CSS property names that are related to the camera functionality. */
export const cameraProp = {
	offset: "--mutti-camera-offset",
	zoom: "--mutti-camera-zoom",
	dayWidth: "--mutti-dayWidth",
};

export class CameraController implements ReactiveController {
	private readonly camera: Camera;

	private isPanning = false;
	private mouseX = 0;

	constructor(
		private readonly host: LitElement,
		config?: Partial<CameraConfig>
	) {
		host.addController(this);
		this.camera = new Camera(config);
		this.setHostProperties();
	}

	hostConnected() {
		document.addEventListener("keydown", this.handleKeydown);

		this.host.addEventListener("pointerdown", this.handlePointerDown);
		this.host.addEventListener("pointermove", this.handlePointerMove);
		this.host.addEventListener("pointerup", this.handlePointerUp);
		this.host.addEventListener("pointerleave", this.handlePointerUp);

		this.host.addEventListener("wheel", this.handleWheel, { passive: false });
	}

	hostDisconnected() {
		document.removeEventListener("keydown", this.handleKeydown);

		this.host.removeEventListener("pointerdown", this.handlePointerDown);
		this.host.removeEventListener("pointermove", this.handlePointerMove);
		this.host.removeEventListener("pointerup", this.handlePointerUp);
		this.host.removeEventListener("pointerleave", this.handlePointerUp);

		this.host.removeEventListener("wheel", this.handleWheel);
	}

	private setHostProperties() {
		// Setting the CSS properties directly can skip Lit rerenders for these high-performance interactions.
		this.host.style.setProperty(cameraProp.offset, `${this.camera.offset}px`);
		this.host.style.setProperty(cameraProp.zoom, this.camera.zoom.toString());
		this.host.style.setProperty(
			cameraProp.dayWidth,
			`${this.camera.dayWidth}px`
		);
	}

	private handleKeydown = (e: KeyboardEvent) => {
		switch (e.code) {
			case "KeyR":
				if (!e.ctrlKey || e.repeat) return;
				this.camera.reset();
				this.setHostProperties();
				break;
		}
	};

	private handlePointerDown = (e: PointerEvent) => {
		this.isPanning = true;
		this.mouseX = e.pageX;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	private handlePointerUp = (e: PointerEvent) => {
		this.isPanning = false;
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	};

	private handlePointerMove = (e: PointerEvent) => {
		if (!this.isPanning) return;

		this.camera.changeOffset(e.pageX - this.mouseX);
		this.setHostProperties();
		this.mouseX = e.pageX;
	};

	private handleWheel = (e: WheelEvent) => {
		if (!e.ctrlKey) return;
		e.preventDefault();

		// Dividing the wheel delta by 1000 appears to provide a pleasant zoom experience
		// that feels neither too slow nor too fast.
		this.camera.changeZoom((e.deltaY * -1) / 1000);
		this.setHostProperties();
	};
}

import type { LitElement, ReactiveController } from "lit";
import {
	ResizeController,
	ResizeValueCallback,
} from "@lit-labs/observers/resize_controller.js";
import { Camera, CameraConfig, ViewPort } from "../core/camera.js";
import { ItemFocusEvent } from "../core/events.js";
import { PointerController } from "./pointer-controller.js";

export enum ZoomDetailLevel {
	Year = 0,
	Month = 1,
	Day = 2,
}

/** Custom CSS property names that are related to the camera functionality. */
export const cameraProp = {
	offset: "--mutti-camera-offset",
	zoom: "--mutti-camera-zoom",
	dayWidth: "--mutti-day-width",
};

export class CameraController implements ReactiveController {
	private readonly camera: Camera;
	private readonly resizeController: ResizeController;
	private readonly pointerController: PointerController;

	constructor(
		private readonly host: LitElement,
		config?: Partial<CameraConfig>
	) {
		host.addController(this);
		this.camera = new Camera(config);
		this.resizeController = new ResizeController(host, {
			callback: this.handleResize,
		});
		this.pointerController = new PointerController(host, {
			moveHandler: (_, delta) => {
				this.camera.changeOffset(delta.x);
				this.setHostPropertiesAndUpdate();
			},
		});
		this.setHostPropertiesAndUpdate();
	}

	get zoomDetail(): ZoomDetailLevel {
		if (this.camera.zoom <= 0.3) return ZoomDetailLevel.Year;
		if (this.camera.zoom <= 2) return ZoomDetailLevel.Month;
		return ZoomDetailLevel.Day;
	}

	get dayWidth(): number {
		return this.camera.dayWidth;
	}

	get offset(): number {
		return this.camera.offset;
	}

	get viewport(): ViewPort {
		return this.camera.viewport;
	}

	get updateConfig() {
		return this.camera.updateConfig.bind(this.camera);
	}

	hostConnected() {
		document.addEventListener("keydown", this.handleKeydown);
		this.host.addEventListener(ItemFocusEvent.type, this.handleItemFocus);
		this.host.addEventListener("wheel", this.handleWheel, { passive: false });
	}

	hostDisconnected() {
		document.removeEventListener("keydown", this.handleKeydown);
		this.host.removeEventListener(ItemFocusEvent.type, this.handleItemFocus);
		this.host.removeEventListener("wheel", this.handleWheel);
	}

	private setHostPropertiesAndUpdate() {
		// Setting the CSS properties directly can skip Lit rerenders for these high-performance interactions.
		this.host.style.setProperty(cameraProp.offset, `${this.camera.offset}px`);
		this.host.style.setProperty(cameraProp.zoom, this.camera.zoom.toString());
		this.host.style.setProperty(
			cameraProp.dayWidth,
			`${this.camera.dayWidth}px`
		);
		this.host.requestUpdate();
	}

	private handleResize: ResizeValueCallback = (entries) => {
		const contentSize = entries[0]?.contentBoxSize[0];

		if (!contentSize) {
			// Initial setup call
			const box = this.host.getBoundingClientRect();
			this.camera.changeViewport(box.width, box.height);
			return;
		}

		// The resize controller will request an update
		this.camera.changeViewport(contentSize.inlineSize, contentSize.blockSize);
	};

	private handleItemFocus = (e: ItemFocusEvent) => {
		if (e.defaultPrevented) return;

		// Dates are plotted relative to today, which is positioned at the current offset.
		// Therefore, they are converted to absolute positions on the timeline.
		const start = this.camera.offset + e.start.getDaysFromNow() * this.dayWidth;
		const end = this.camera.offset + e.end.getDaysFromNow() * this.dayWidth;

		this.camera.moveRangeIntoViewport(start, end);
		this.setHostPropertiesAndUpdate();
	};

	private handleKeydown = (e: KeyboardEvent) => {
		switch (e.code) {
			case "KeyR":
				if (!e.ctrlKey || e.repeat) return;
				this.camera.reset();
				this.setHostPropertiesAndUpdate();
				break;
		}
	};

	private handleWheel = (e: WheelEvent) => {
		if (!e.ctrlKey) return;
		e.preventDefault();

		// There is no reliable API to get the mouse position on the timeline from the event.
		// Therefore, we calculate it ourself to let the camera zoom towards the mouse position.
		// Note: getBoundingClientRect is surprisingly fast. Browsers probably cache the values.
		const hostX = this.host.getBoundingClientRect().x;
		const mouseX = e.pageX - hostX;

		// Dividing the wheel delta by 1000 appears to provide a pleasant zoom experience
		// that feels neither too slow nor too fast.
		this.camera.changeZoom((e.deltaY * -1) / 1000, mouseX);
		this.setHostPropertiesAndUpdate();
	};
}

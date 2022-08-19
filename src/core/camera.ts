export interface ViewPort {
	width: number;
	height: number;
}

export interface CameraConfig {
	initialDayWidth: number;
	initialDayOffset: number;
	initialZoom: number;
	minZoom: number;
	maxZoom: number;
	viewportPadding: number;
}

const defaultConfig: CameraConfig = {
	initialDayWidth: 4,
	initialDayOffset: 0,
	initialZoom: 1,
	minZoom: 0.1,
	maxZoom: 2,
	viewportPadding: 100,
};

export class Camera {
	private config: CameraConfig = {} as CameraConfig;

	private _offset: number;
	private _zoom: number;
	private _viewport: ViewPort;

	constructor(config?: Partial<CameraConfig>) {
		this.updateConfig(config);

		this._offset = this.initialOffset;
		this._zoom = this.config.initialZoom;
		this._viewport = { width: 0, height: 0 };
	}

	private get initialOffset() {
		return (
			this.config.initialDayWidth * this.config.initialDayOffset +
			this.config.viewportPadding
		);
	}

	get offset() {
		return this._offset;
	}

	get zoom() {
		return this._zoom;
	}

	get dayWidth() {
		return this._zoom * this.config.initialDayWidth;
	}

	get viewport() {
		return this._viewport;
	}

	public updateConfig(config?: Partial<CameraConfig>): CameraConfig {
		this.config = {
			...defaultConfig,
			...this.config,
			...config,
		};
		return this.config;
	}

	public changeOffset(by: number) {
		this._offset += by;
	}

	/** Changes the offset to display the given range in the viewport. */
	public moveRangeIntoViewport(start: number, end: number) {
		const leftPadded = this.config.viewportPadding;
		const rightPadded = this.viewport.width - this.config.viewportPadding;

		switch (true) {
			case start >= leftPadded && end <= rightPadded:
				return;
			case start < leftPadded:
				return this.changeOffset(leftPadded - start);
			case true:
				return this.changeOffset(rightPadded - end);
		}
	}

	public changeZoom(by: number, towards: number) {
		const offsetInDaysBefore = (this.offset - towards) / this.dayWidth;
		this._zoom = this.clamp(
			this.config.minZoom,
			this._zoom + by,
			this.config.maxZoom
		);
		const offsetInDaysAfter = (this.offset - towards) / this.dayWidth;
		const daysDelta = offsetInDaysBefore - offsetInDaysAfter;
		this.changeOffset(daysDelta * this.dayWidth);
	}

	public changeViewport(width: number, height: number) {
		this._viewport = { width, height };
	}

	public reset() {
		this._zoom = this.config.initialZoom;
		this._offset = this.initialOffset;
	}

	private clamp(min: number, actual: number, max: number): number {
		if (actual <= min) return min;
		if (actual >= max) return max;
		return actual;
	}
}

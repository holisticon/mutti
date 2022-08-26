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
}

export class Camera {
	private readonly config: CameraConfig;

	private _offset: number;
	private _zoom: number;
	private _viewport: ViewPort;

	constructor(config?: Partial<CameraConfig>) {
		this.config = {
			initialDayWidth: config?.initialDayWidth ?? 4,
			initialDayOffset: config?.initialDayOffset ?? 0,
			initialZoom: config?.initialZoom ?? 1,
			minZoom: config?.minZoom ?? 0.1,
			maxZoom: config?.maxZoom ?? 2,
		};

		this._zoom = this.config.initialZoom;
		this._viewport = { width: 0, height: 0 };
		this._offset = this.dayWidth * this.config.initialDayOffset;
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

	public changeOffset(by: number) {
		this._offset += by;
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
		this._offset = this.config.initialDayWidth * this.config.initialDayOffset;
	}

	private clamp(min: number, actual: number, max: number): number {
		if (actual <= min) return min;
		if (actual >= max) return max;
		return actual;
	}
}

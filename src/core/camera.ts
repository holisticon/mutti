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

	constructor(config?: Partial<CameraConfig>) {
		this.config = {
			initialDayWidth: config?.initialDayWidth ?? 4,
			initialDayOffset: config?.initialDayOffset ?? 0,
			initialZoom: config?.initialZoom ?? 1,
			minZoom: config?.minZoom ?? 0.1,
			maxZoom: config?.maxZoom ?? 2,
		};

		this._offset = this.config.initialDayWidth * this.config.initialDayOffset;
		this._zoom = this.config.initialZoom;
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

	public changeOffset(by: number) {
		this._offset += by;
	}

	public changeZoom(by: number) {
		this._zoom = this.clamp(
			this.config.minZoom,
			this._zoom + by,
			this.config.maxZoom
		);
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
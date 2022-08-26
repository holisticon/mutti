import { Camera } from "./camera.js";

describe("Camera", () => {
	describe("configuration", () => {
		it("should use default camera values if no config is provided", () => {
			const cam = new Camera();

			expect(cam.zoom).toBe(1);
			expect(cam.dayWidth).toBe(4);
			expect(cam.offset).toBe(0);
			expect(cam.viewport.width).toBe(0);
			expect(cam.viewport.height).toBe(0);
		});

		it("should set the initial camera based in the provided config", () => {
			const cam = new Camera({ initialZoom: 1.5, initialDayOffset: 50 });

			expect(cam.zoom).toBe(1.5);
			expect(cam.dayWidth).toBe(6);
			expect(cam.offset).toBe(300);
		});
	});

	describe("changeOffset", () => {
		it("should add the given amount to the current offset", () => {
			const cam = new Camera();

			cam.changeOffset(50);
			expect(cam.offset).toBe(50);
			cam.changeOffset(-100);
			expect(cam.offset).toBe(-50);
		});
	});

	describe("changeViewport", () => {
		it("should set the viewport of the camera", () => {
			const cam = new Camera();

			cam.changeViewport(1200, 800);

			expect(cam.viewport.width).toBe(1200);
			expect(cam.viewport.height).toBe(800);
		});
	});

	describe("changeZoom", () => {
		it("should change the zoom by the given amount", () => {
			const cam = new Camera();

			cam.changeZoom(0.5, 0);
			expect(cam.zoom).toBe(1.5);
			cam.changeZoom(-1, 0);
			expect(cam.zoom).toBe(0.5);
		});

		it("should not increase the zoom beyond the default min and max cap", () => {
			const cam = new Camera();

			cam.changeZoom(5, 0);
			expect(cam.zoom).toBe(2);
			cam.changeZoom(-5, 0);
			expect(cam.zoom).toBe(0.1);
		});

		it("should change the offset depending on the changed dayWidth", () => {
			const cam = new Camera({ initialDayOffset: 1000 });

			cam.changeZoom(1, 0);

			expect(cam.zoom).toBe(2);
			expect(cam.dayWidth).toBe(8);
			expect(cam.offset).toBe(8000);
		});

		it("should change the offset towards given position in the camera viewport", () => {
			const cam = new Camera({ initialDayOffset: 1000 });

			cam.changeZoom(1, 200);

			expect(cam.zoom).toBe(2);
			expect(cam.dayWidth).toBe(8);
			expect(cam.offset).toBe(7800);
		});
	});
});

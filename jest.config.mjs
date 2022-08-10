/** @type {import("jest").Config}  */
const config = {
	roots: ["src"],
	testEnvironment: "@happy-dom/jest-environment",
	collectCoverageFrom: ["src/**", "!src/main.ts"],
	transform: {
		"^.+\\.(t|j)sx?$": ["@swc/jest"],
	},
	extensionsToTreatAsEsm: [".ts"],
};

export default config;

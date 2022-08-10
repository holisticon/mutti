import { PlaywrightTestConfig } from "@playwright/test";
import serverConfig from "./web-dev-server.config.mjs";

const config: PlaywrightTestConfig = {
	testDir: "test",
	retries: 1,
	forbidOnly: Boolean(process.env.CI),
	webServer: {
		command: `npm run serve`,
		port: serverConfig.port,
		reuseExistingServer: !process.env.CI,
	},
	use: {
		baseURL: `http://127.0.0.1:${serverConfig.port}`,
		launchOptions: {
			slowMo: process.env.SLOW ? parseInt(process.env.SLOW) : undefined,
		},
		trace: "on-first-retry",
		video: "on-first-retry",
	},
};

export default config;

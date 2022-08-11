import { esbuildPlugin } from "@web/dev-server-esbuild";

/** @type {import("@web/dev-server").DevServerConfig}  */
const config = {
	port: 9000,
	nodeResolve: true,
	plugins: [esbuildPlugin({ ts: true, target: "es2020" })],
};

export default config;

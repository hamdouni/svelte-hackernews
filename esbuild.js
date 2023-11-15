import * as esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';

const dir = './public';
const host = "localhost";
const port = 5000;
const isWatch = process.argv.includes('-w');

let base = {
	outdir: dir,
	entryPoints: ['./app.svelte'],
	bundle: true,
	format: 'esm',
	plugins: [
		sveltePlugin({
			compilerOptions: { customElement: true },
		})
	],
};
let dev = {
	...base,
	banner: {
		js: `new EventSource("http://${host}:${port}/esbuild").addEventListener("change",()=>location.reload())`,
	},
	logLevel: 'info',
}
let prod = {
	...base,
	minify: true,
	sourcemap: true,
}

if (!isWatch) {
	await esbuild.build(prod);
	process.exit(0);
}

let ctx = await esbuild.context(dev);
await ctx.watch();
await ctx.serve({ servedir: dir, port: port, host: host });


import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { unpkgFetchPlugin } from './plugins/unpkg-fetch-plugin';

let service: esbuild.Service;

const bundle = async (rawCode: string) => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            // get esbuild.wasm from unpkg.com
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });
    }

    const result = await service.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), unpkgFetchPlugin(rawCode)],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window'
        }
    });

    return result.outputFiles[0].text;
};

export default bundle;
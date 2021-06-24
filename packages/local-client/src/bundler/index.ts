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

    try {
        const result = await service.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), unpkgFetchPlugin(rawCode)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
            // tell esBuild to use _React instead React
            // because we want to avoid naming collision when user also import React
            jsxFactory: '_React.createElement',
            jsxFragment: '_React.Fragment'
        });
        return {
            code: result.outputFiles[0].text,
            err: ''
        }
    } catch (err) {
        return {
            code: '',
            err: err.message
        }
    }
};

export default bundle;
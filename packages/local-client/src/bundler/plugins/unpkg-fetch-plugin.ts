import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
    name: 'filecache'
});

export const unpkgFetchPlugin = (inputCode: string) => {
    return {
        name: 'unpkg-fetch-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onLoad({ filter: /^index\.js$/ }, () => {
                return {
                    loader: 'jsx',
                    contents: inputCode,
                };
            });

            // by not returning an object, esbuild will then run the next onload method after this onload
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                // Check to see if we have already fetched this file
                // and if it is in the cache
                const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

                // // if it is, return it immediately
                if (cacheResult) {
                    return cacheResult;
                }
            });

            // esbuild working in browser can only write everything into one output
            // it can not seperate css and javascript into two files
            // doesn't work for css with @import statement or url(), works for most of the css file
            build.onLoad({ filter: /\.css$/ }, async (args: any) => {
                const { data, request } = await axios.get(args.path);

                // escape the css file and put it into a style tag
                const escaped = data.replace(/\n/g, '')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'");

                const contents = `
                    const style = document.createElement('style');
                    style.innerText = '${escaped}';
                    document.head.appendChild(style);
                    `;

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: contents,
                    resolveDir: new URL('./', request.responseURL).pathname
                };

                // store response in cache 
                await fileCache.setItem(args.path, result);

                return result;
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                const { data, request } = await axios.get(args.path);

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                };

                // store response in cache 
                await fileCache.setItem(args.path, result);

                return result;
            });
        }
    }
}
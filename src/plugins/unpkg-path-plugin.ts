import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // Overwrite onResolve method to return the file path that we want esBuild to use
            // Esbuild's default behavior is to find the file in the file system

            // Handle root entry file of 'index.js'
            build.onResolve({ filter: /^index\.js$/ }, () => {
                // console.log('onResolve', args);
                return { path: 'index.js', namespace: 'a' };
            });

            // Handle relative paths in a module
            build.onResolve({ filter: /^\.+\// }, (args: any) => {
                // console.log('onResolve', args);
                return {
                    namespace: 'a',
                    path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
                };
            });

            // Handle main file of a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                // console.log('onResolve', args);
                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                };
            });
        },
    };
};
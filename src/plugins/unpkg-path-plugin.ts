import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // overwrite the onResolve to return the file path that we want esBuild to use
            // default behavior is to find the file in the file system
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResole', args);
                return { path: args.path, namespace: 'a' };
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
              import message from 'tiny-test-pkg';
              console.log(message);
            `,
                    };
                }
            });
        },
    };
};
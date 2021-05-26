import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (port: number, filename: string, dir: string, useProxy: boolean) => {
    const app = express();

    app.use(createCellsRouter(filename, dir));

    // useProxy is true if it's on the development mode
    if (useProxy) {
        // use proxy to local Create React App server
        app.use(createProxyMiddleware({
            target: 'http://localhost:3000',
            ws: true,
            logLevel: 'silent'
        }));
    } else {
        // use require.resolve to figure out the location of the file
        const packagePath = require.resolve('@js-notebook/local-client/build/index.html');
        app.use(express.static(path.dirname(packagePath)));
    }

    // return a promiss so that the cli can await this function
    // to see if there is an error
    return new Promise<void>((resolve, reject) => {
        app.listen(port, resolve).on('error', reject);
    });
};
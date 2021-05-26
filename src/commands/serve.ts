import path from 'path';
import { Command } from 'commander';
import { serve } from '@js-notebook/local-api';

const isProduction = process.env.NODE_ENV === 'production';

// watching for the serve command (i.e. jbook serve)
export const serveCommand = new Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action(async (filename = 'notebook.js', options: { port: string }) => {
        try {
            // calculate the directory of the file the user want to open
            const dir = path.join(process.cwd(), path.dirname(filename));
            await serve(parseInt(options.port), path.basename(filename), dir, !isProduction);
            console.log(
                `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file`
            )
        } catch (err) {
            // error handling
            if (err.code === 'EADDRINUSE') {
                console.error('Port is in use. Try running on a different port.');
            } else {
                console.log('Error:', err.message);
            }

            // force the program to exit if there is error
            process.exit(1);
        }
    });
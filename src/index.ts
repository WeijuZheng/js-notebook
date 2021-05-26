#!usr/bin/env node
import { program } from 'commander';
import { serveCommand } from './commands/serve';

// add the command handler to the program
program.addCommand(serveCommand);

program.parse(process.argv);
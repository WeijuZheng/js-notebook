"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var serve_1 = require("./commands/serve");
// add the command handler to the program
commander_1.program.addCommand(serve_1.serveCommand);
commander_1.program.parse(process.argv);

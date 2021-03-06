#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libfs = require("fs");
const libos = require("os");
const libpath = require("path");
const autoguard = require("../autoguard-lib");
function findFiles(path, paths = []) {
    let stat = libfs.statSync(path);
    if (stat.isDirectory() && libpath.basename(path) !== "node_modules") {
        libfs.readdirSync(path).map((subpath) => {
            return libpath.join(path, subpath);
        }).map((path) => {
            return findFiles(path, paths);
        });
    }
    else if (stat.isFile() && libpath.extname(path) === ".ag") {
        paths.push(path);
    }
    return paths;
}
function filename(path) {
    return libpath.basename(path).split(".").slice(0, -1).join(".");
}
function run() {
    let options = {
        eol: libos.EOL,
        root: "./",
        standalone: true
    };
    let found_unrecognized_argument = false;
    for (let argv of process.argv.slice(2)) {
        let parts = null;
        if (false) {
        }
        else if ((parts = /^--eol=(.+)$/.exec(argv)) != null) {
            options.eol = parts[1];
        }
        else if ((parts = /^--root=(.+)$/.exec(argv)) != null) {
            options.root = parts[1];
        }
        else if ((parts = /^--standalone=(true|false)$/.exec(argv)) != null) {
            options.standalone = parts[1] === "true" ? true : false;
        }
        else {
            found_unrecognized_argument = true;
            process.stderr.write("Unrecognized argument \"" + argv + "\"!\n");
        }
    }
    if (found_unrecognized_argument) {
        process.stderr.write("Arguments:\n");
        process.stderr.write("	--eol=string\n");
        process.stderr.write("	--root=string\n");
        process.stderr.write("	--standalone=boolean\n");
        process.exit(0);
    }
    let paths = findFiles(options.root);
    let result = paths.reduce((sum, path) => {
        process.stderr.write("Processing \"" + path + "\"...\n");
        try {
            let input = libfs.readFileSync(path, "utf8");
            let start = Date.now();
            let generated = autoguard.transform(input, options);
            let duration = Date.now() - start;
            process.stderr.write("	Transform: " + duration + " ms\n");
            path = libpath.join(libpath.dirname(path), filename(path) + ".ts");
            libfs.writeFileSync(path, generated, "utf8");
            return sum + 0;
        }
        catch (error) {
            process.stderr.write("\t" + error + "\n");
            return sum + 1;
        }
    }, 0);
    process.exit(result);
}
run();

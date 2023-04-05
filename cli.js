#!/usr/bin/env node
import { program } from "commander";
import chalkRainbow from "chalk-rainbow";
import { getRandomColor } from "./colors.js";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

let defaultExclude = ["node_modules", ".git", ".vscode"];
let dirCount = 0;
let fileCount = 0;
let color = false;
let depth = 0;
let maxDepth = Infinity;
let dirColor = "";
let fileColor = "";
let rootDir;

export const printDirectoryContents = ({
  directory,
  indent = "",
  exclude = "",
  folders = false,
  depth,
  size,
}) => {
  const contents = fs.readdirSync(directory);
  if (contents.length > size) return;

  if (depth > maxDepth) return;

  contents.forEach((file, idx) => {
    if (exclude.includes(file)) return;

    let prefix = "";
    let rootLine = "";
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    const isDir = stats.isDirectory();

    if (idx === contents.length - 1) {
      prefix = " └── ";
    } else {
      prefix = " ├── ";
    }
    // check if this is last file in dir, if so add prefix of └──
    // if not add prefix of ├──
    // need to check if we are at the root dir, if not, add the base prefix of |
    if (rootDir !== path.resolve(directory)) {
      rootLine = " │  ";
    }
    if (color) {
      console.log(
        `${rootLine}${indent}${prefix}`,
        chalk.hex(getRandomColor())(`${file}`)
      );
    } else {
      depth % 2 === 0
        ? console.log(
            chalk.cyan(`${rootLine}${indent}${prefix}`),
            isDir
              ? chalk.redBright(`${file}`, "blue")
              : chalk.greenBright(`${file}`)
          )
        : console.log(
            chalk.cyan(`${rootLine}${indent}${prefix}`),
            isDir ? chalk.magentaBright(`${file}`) : chalk.yellow(`${file}`)
          );
    }

    if (isDir) {
      dirCount++;
      printDirectoryContents({
        directory: fullPath,
        indent: `  ${indent}`,
        exclude,
        depth: depth + 1,
        size,
      });
    } else {
      fileCount++;
    }
  });
};

// Logical flow of the program:
// 1. Get the directory from the user
// 2. Get the options from the user
// 3. assign options to variables
// 4. if the user wants to print all files and directories, call printDirectoryContents with exclude = []
// 5. if the user wants to print only directories, call printDirectoryContents with folders = true
// 6. if the user wants to print with random colors, call printDirectoryContents with color = true
// 7. otherwise, call printDirectoryContents with whatever is excluded - including default excludes - and the size and depth

program
  .version("1.0.0")
  .arguments("<directory>")
  .description(
    "Print a colorful tree representation of the structure of a given directory"
  )
  .option("-e, --exclude <s>", "Exclude folders matching the given pattern")
  .option("-d, --depth <n>", "Maximum depth to print", parseInt)
  .option("-s, --size <n>", "Maximum size directory to print", parseInt)
  .option("-f, --folders", "Only print directories")
  .option("-c, --color", "Colorize output with random color scheme")
  .option("-a, --all", "Print all files and directories")
  .action((directory) => {
    try {
      rootDir = path.resolve(directory);
      console.log(directory);
      let {
        exclude,
        depth: inputDepth,
        size,
        folders,
        color: chosenColor,
        all,
      } = program.opts();

      if (chosenColor) color = chosenColor;
      if (inputDepth !== undefined) maxDepth = inputDepth;

      if (all !== undefined) {
        printDirectoryContents({ directory, exclude: [], depth });
        return;
      }
      if (folders !== undefined) {
        printDirectoryContents({ directory, exclude: [], depth });
        return;
      }

      const excludeArr = exclude
        ? defaultExclude.concat(exclude.split())
        : defaultExclude;
      if (color) {
        printDirectoryContents({
          directory,
          exclude: excludeArr,
          size: (size = Infinity),
          depth,
        });
        return;
      }
      printDirectoryContents({
        directory,
        exclude: excludeArr,
        size: (size = Infinity),
        depth,
      });

      console.log(chalk.green(`${dirCount} folders, ${fileCount} files \n`));
    } catch (error) {
      console.error(`Error printing directory structure: ${error.message}`);
    }
  });

program.on("--help", () => {
  console.log("Example:");
  console.log("  $ directory-structure ./my-folder");
});

program.parse(process.argv);

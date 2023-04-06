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
let rootDir;
let depths = [];
let prevDepths = [];
const verticalLine = " │  ";
const lastFileLine = " └── ";
const connectedFileLine = " ├── ";

export const printDirectoryContents = ({
  directory,
  indent = "",
  exclude = "",
  depth,
  size,
}) => {
  const contents = fs.readdirSync(directory);
  if (contents.length > size) {
    if (path.resolve(directory) === rootDir) {
      console.log(
        chalk.cyan(
          "Make sure your size input is not smaller than the root directory size"
        )
      );
    }
    return;
  }

  if (depth > maxDepth) return;

  contents.forEach((file, idx) => {
    if (exclude.includes(file)) return;

    let prefix = "";
    depths = [];

    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    const isDir = stats.isDirectory();

    // to build the prefix you have to use a for loop that iterates through the depth
    // and adds verticalLine if we have not reached the end of a dir at that depth,
    // according to the prevDepths array and add indent to prefix
    // once we reach the current depth, we check if the file is the last file in the dir and
    // alter the prefix accordingly, then log the prefix + filename to the console
    for (let i = 0; i <= depth; i++) {
      if (depth === 0) {
        if (idx === contents.length - 1) {
          prefix = lastFileLine;
          depths[i] = "last";
          continue;
        } else {
          prefix = connectedFileLine;
          depths[i] = "connected";
          continue;
        }
      }
      if (i === depth) {
        if (idx === contents.length - 1) {
          prefix += lastFileLine;
          depths[i] = "last";
          break;
        } else {
          prefix += connectedFileLine;
          depths[i] = "connected";
          break;
        }
      }
      // check if file at current depth is last file in dir, if not, add prefix of │

      if (prevDepths[i] === "connected") {
        prefix += `${verticalLine}  `;
        depths[i] = "connected";
      } else {
        prefix += `  `;
      }
      prefix += " ";
    }
    prevDepths = depths;
    if (color) {
      isDir
        ? console.log(
            chalk.hex(getRandomColor())(`${prefix}`),
            chalk.hex(getRandomColor())(`${file}/`)
          )
        : console.log(
            chalk.hex(getRandomColor())(`${prefix}`),
            chalk.hex(getRandomColor())(`${file}`)
          );
    } else {
      depth % 2 === 0
        ? console.log(
            `${prefix}`,
            isDir
              ? chalk.hex("#ecb133")(`${file}/`)
              : chalk.hex("#17a762")(`${file}`)
          )
        : console.log(
            `${prefix}`,
            isDir
              ? chalk.hex("#ff6b8c")(`${file}/`)
              : chalk.hex("#ff3d37")(`${file}`)
          );
    }

    if (isDir) {
      dirCount++;
      printDirectoryContents({
        directory: fullPath,
        indent: `${indent}`,
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
// 5. if the user wants to print with random colors, call printDirectoryContents with color = true
// 6. otherwise, call printDirectoryContents with whatever is excluded - including default excludes - and the size and depth

program
  .version("1.0.0")
  .arguments("<directory>")
  .description(
    chalk.greenBright(
      "Print a colorful tree representation of the structure of a given directory"
    )
  )
  .option("-e, --exclude <s>", "Exclude folders matching the given pattern")
  .option("-d, --depth <n>", "Maximum depth to print", parseInt)
  .option("-s, --size <n>", "Maximum size directory to print", parseInt)
  .option("-c, --color", "Colorize output with random color scheme")
  .option("-a, --all", "Print all files and directories")
  .action((directory) => {
    try {
      rootDir = path.resolve(directory);
      console.log(directory);
      let {
        exclude,
        depth: inputDepth,
        size: inputSize,

        color: chosenColor,
        all,
      } = program.opts();

      if (chosenColor) color = chosenColor;
      if (inputDepth !== undefined) maxDepth = inputDepth;

      if (all !== undefined) {
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
          size: inputSize ? inputSize : Infinity,
          depth,
        });
        return;
      }
      printDirectoryContents({
        directory,
        exclude: excludeArr,
        size: inputSize ? inputSize : Infinity,
        depth,
      });

      console.log(chalk.green(`${dirCount} folders, ${fileCount} files \n`));
    } catch (error) {
      console.error(
        chalk.redBright(`Error printing directory structure: ${error.message}`)
      );
    }
  });

program.on("--help", () => {
  console.log("Example:");
  console.log("  $ directory-structure ./my-folder");
});

program.parse(process.argv);

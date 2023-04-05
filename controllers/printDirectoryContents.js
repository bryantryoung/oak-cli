import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

let dirCount = 0;
let fileCount = 0;

export const printDirectoryContents = (directory, indent = "") => {
  const contents = fs.readdirSync(directory);
  contents.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    console.log(chalk.green(`${indent}${file}`));
    if (stats.isDirectory()) {
      dirCount++;
      printDirectoryContents(fullPath, `${indent}  `);
    } else {
      fileCount++;
    }
  });
  chalk.cyan(`Directory Count: ${dirCount} File Count: ${fileCount} \n`);
};

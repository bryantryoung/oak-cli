# 🌳 Oak - A CLI tool for visualizing directories with lots of color!

## Oak CLI is a tool I made for fun in my free time to familiarize myself with publishing packages publicly to npm. Feel free to submit a PR or open an issue if you find a bug or have a feature request!

Install the package globally with either yarn or npm:

```
yarn global add @bryoung/oak
```
or
```
npm install -g @bryoung/oak
```

To use the package, simply call `oak` and pass a directory as well as any of 6 optional commands. 

```
Usage: oak [options] <directory>

Print a colorful tree representation of the structure of a given directory

Options:
  -V, --version      output the version number
  -e, --exclude <s>  Exclude folders matching the given pattern
  -d, --depth <n>    Maximum depth to print
  -s, --size <n>     Maximum size directory to print
  -c, --color        Colorize output with random color scheme
  -a, --all          Print all files and directories
  -h, --help         display help for command
Example:
  $ oak ./my-folder
```
## Sample Output:

<img width="398" alt="Screen Shot 2023-04-07 at 11 14 50 PM" src="https://user-images.githubusercontent.com/99948055/230702839-1a61d910-cc38-4a1d-8e4b-f1a26ecf01e8.png">

## Options

Use `--color` to colorize the output of your directory structure with random colors:

<img width="351" alt="Screen Shot 2023-04-07 at 11 15 06 PM" src="https://user-images.githubusercontent.com/99948055/230702851-c7bb8dc9-bc46-48f3-8eef-2cb1b3a04cc4.png">

Use `--exclude=<file>` to exclude all folders/files matching a given pattern:

<img width="403" alt="Screen Shot 2023-04-07 at 11 16 18 PM" src="https://user-images.githubusercontent.com/99948055/230702871-5ca5065e-0483-4dcb-bd59-16d2ba504244.png">

Use `--depth <number>` and pass an integer to only print the directory to n levels of depth (starting from 0). Example in the same directory as previous snippets:

<img width="390" alt="Screen Shot 2023-04-07 at 11 16 57 PM" src="https://user-images.githubusercontent.com/99948055/230703002-9173f1bf-c1e0-411c-b753-f7ddda274af3.png">


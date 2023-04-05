import chalk from "chalk";

export const getRandomColor = () => {
  const hexArr = [
    "FF0000",
    "FF7F00",
    "FFFF00",
    "00FF00",
    "0000FF",
    "4B0082",
    "9400D3",
    "FF00FF",
    "FF1493",
    "FF69B4",
    "FFB6C1",
    "FFC0CB",
  ];

  const randomIndex = Math.floor(Math.random() * hexArr.length);
  return hexArr[randomIndex];
};

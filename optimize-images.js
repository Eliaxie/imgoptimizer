// scripts/optimize-images.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "input/img");
const targetDirNormal = path.join(__dirname, "dist/opt_img_normal");
const targetDirOptimized = path.join(__dirname, "dist/opt_img_optimized");

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}
if (!fs.existsSync(targetDirNormal)) {
  fs.mkdirSync(targetDirNormal);
}
if (!fs.existsSync(targetDirOptimized)) {
  fs.mkdirSync(targetDirOptimized);
}

const processImage = async (
  sourcePath,
  targetPathNormal,
  targetPathOptimized
) => {
  const image = sharp(sourcePath);

  // Normal images at 60% quality
  await image
    .webp({
      quality: 80,
    })
    .toFile(targetPathNormal.replace(path.extname(targetPathNormal), ".webp"));

  // Highly optimized images
  await image
    .resize(200) // Modify this to the dimension you want
    .webp({
      quality: 80, // Modify this to the quality you want
    })
    .toFile(
      targetPathOptimized.replace(path.extname(targetPathOptimized), ".webp")
    );
};

const processDirectory = (sourceDir, targetDirNormal, targetDirOptimized) => {
  fs.readdirSync(sourceDir, { withFileTypes: true }).forEach(async (dirent) => {
    const sourcePath = path.join(sourceDir, dirent.name);
    const targetPathNormal = path.join(targetDirNormal, dirent.name);
    const targetPathOptimized = path.join(targetDirOptimized, dirent.name);

    if (dirent.isDirectory()) {
      if (!fs.existsSync(targetPathNormal)) {
        fs.mkdirSync(targetPathNormal, { recursive: true });
      }
      if (!fs.existsSync(targetPathOptimized)) {
        fs.mkdirSync(targetPathOptimized, { recursive: true });
      }
      processDirectory(sourcePath, targetPathNormal, targetPathOptimized);
    } else if (
      dirent.isFile() &&
      [".jpg", ".jpeg", ".png"].includes(path.extname(dirent.name))
    ) {
      await processImage(sourcePath, targetPathNormal, targetPathOptimized);
    }
  });
};

processDirectory(sourceDir, targetDirNormal, targetDirOptimized);

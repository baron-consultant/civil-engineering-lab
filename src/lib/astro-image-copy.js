// src/config/astro-image-copy.js
import fs from "fs-extra";
import path from "path";

/**
 * 이미지 복사 최적화 Integration
 * - dev 모드: 초기 복사만 수행
 * - build 모드: 변경된 파일만 복사
 */
export function copyImagesIntegration() {
  const sourceDir = path.resolve("src/assets/images");
  const targetDir = path.resolve("public/images");

  async function copyChangedFiles() {
    await fs.ensureDir(targetDir);

    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(targetDir, file);

      const srcStat = await fs.stat(srcPath);
      const destExists = await fs.pathExists(destPath);
      const destStat = destExists ? await fs.stat(destPath) : null;

      // dest가 없거나, src가 더 최신이면 복사
      if (!destStat || srcStat.mtimeMs > destStat.mtimeMs) {
        await fs.copy(srcPath, destPath, { overwrite: true });
        console.log(`✅ Copied: ${file}`);
      }
    }
  }

  return {
    name: "copy-images-optimized",
    hooks: {
      "astro:server:start": async () => {
        // dev 모드에서는 초기 한 번만 복사
        try {
          await copyChangedFiles();
          console.log("✅ Images copied (dev mode)");
        } catch (err) {
          console.error("❌ Image copy error (dev mode):", err);
        }
      },
      "astro:build:start": async () => {
        // build 모드에서는 변경된 파일만 복사
        try {
          await copyChangedFiles();
          console.log("✅ Images copied (build mode)");
        } catch (err) {
          console.error("❌ Image copy error (build mode):", err);
        }
      },
    },
  };
}

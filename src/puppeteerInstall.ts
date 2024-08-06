import { homedir } from "node:os";
import { join } from "node:path";

import { Browser, detectBrowserPlatform, install, resolveBuildId } from "@puppeteer/browsers";
import { PUPPETEER_REVISIONS } from "puppeteer-core/internal/revisions.js";

// Based on:
// https://github.com/puppeteer/puppeteer/blob/main/packages/puppeteer/src/node/install.ts

const platform = detectBrowserPlatform();

if (!platform) {
  console.log('{"T":1}');
  process.exit(1);
}

const cacheDir = join(homedir(), ".cache", "puppeteer");

async function installBrowser(browser: Browser) {
  const tag = PUPPETEER_REVISIONS[browser as keyof typeof PUPPETEER_REVISIONS] || "latest";

  return await install({
    browser,
    cacheDir,
    platform,
    buildId: await resolveBuildId(browser, platform!, tag),
    downloadProgressCallback(downloadedBytes, totalBytes) {
      console.log(
        JSON.stringify({
          T: 2,
          d: downloadedBytes,
          t: totalBytes,
        }),
      );
    },
  });
}

try {
  const installedBrowser = await installBrowser(Browser.CHROME);

  console.log(
    JSON.stringify({
      T: 0,
      b: installedBrowser,
    }),
  );
} catch (err) {
  console.log(
    JSON.stringify({
      T: 3,
      e: err?.toString() || err,
      E: Bun.inspect(err, { colors: false }),
    }),
  );
}

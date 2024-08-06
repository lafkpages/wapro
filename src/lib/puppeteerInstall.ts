import type { InstalledBrowser } from "@puppeteer/browsers";

import { Command } from "@tauri-apps/api/shell";

const command = Command.sidecar("../dist/puppeteerInstall");

export async function puppeteerInstall(
  onProgress: (downloadedBytes: number, totalBytes: number) => void,
) {
  let installedBrowser: InstalledBrowser;

  let resolve: (browser: InstalledBrowser) => void;
  let reject: (err: unknown) => void;

  function cleanup() {
    command.off("error", onError);
    command.off("close", onClose);
    command.stdout.off("data", onStdout);
    command.stderr.off("data", onStderr);
  }

  function onError(err: unknown) {
    reject(err);
    cleanup();
  }

  function onClose() {
    if (installedBrowser) {
      resolve(installedBrowser);
    } else {
      reject(new Error("Failed to install Puppeteer browser."));
    }
    cleanup();
  }

  function onStdout(data: unknown) {
    if (typeof data !== "string") {
      console.error("puppeteerInstall stdout received non-string data:", data);
      return;
    }

    const msg = JSON.parse(data);

    switch (msg.T) {
      case 0: {
        installedBrowser = msg.b;
        break;
      }

      case 1: {
        reject(new Error("Failed to detect browser platform."));
        break;
      }

      case 2: {
        onProgress(msg.d, msg.t);
        break;
      }

      case 3: {
        console.error(msg.E);
        reject(new Error(msg.e));
        break;
      }
    }
  }

  function onStderr(data: unknown) {
    console.warn("puppeteerInstall stderr:", data);
  }

  const promise = new Promise<InstalledBrowser>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  command.on("error", reject!);
  command.on("close", resolve!);

  command.stdout.on("data", onStdout);
  command.stderr.on("data", onStderr);

  await command.spawn();

  return await promise;
}

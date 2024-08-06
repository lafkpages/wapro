// TODO: build for all Tauri targets

import { $ } from "bun";

const rustTargetToBunTarget = {
  "aarch64-apple-darwin": "bun-darwin-arm64",
};

for (const [rustTarget, bunTarget] of Object.entries(rustTargetToBunTarget)) {
  await $`bun build --minify --compile ./src/puppeteerInstall.ts --target ${bunTarget} --outfile dist/puppeteerInstall-${rustTarget}`;
}

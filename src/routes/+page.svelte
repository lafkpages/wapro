<script lang="ts">
  import { onMount } from "svelte";

  import { puppeteerInstall } from "$lib/puppeteerInstall";

  let progressMax = 1;
  let progressValue = 0;

  onMount(async () => {
    await puppeteerInstall((downloadedBytes, totalBytes) => {
      progressValue = downloadedBytes;
      progressMax = totalBytes;
    });

    progressValue = progressMax;
  });
</script>

<div>
  <progress max={progressMax} value={progressValue} />
</div>

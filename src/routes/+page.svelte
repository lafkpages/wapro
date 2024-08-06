<script lang="ts">
  import { onMount } from "svelte";

  import { Progress } from "$lib/components/ui/progress";
  import { puppeteerInstall } from "$lib/puppeteerInstall";

  let progressValue = 0;
  let progressMax = 1;

  onMount(async () => {
    await puppeteerInstall((downloadedBytes, totalBytes) => {
      progressValue = downloadedBytes;
      progressMax = totalBytes;
    });

    progressValue = progressMax;
  });
</script>

<div class="flex size-full items-center justify-center">
  <Progress value={progressValue} max={progressMax} />
</div>

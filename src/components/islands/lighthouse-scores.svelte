<script lang="ts">
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  type Score = { label: string; value: number };
  let { scores }: { scores: Score[] } = $props();

  const RADIUS = 34;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // One tween drives every ring, staggered by index, so they finish together.
  const progress = new Tween(0, { duration: 1600, easing: cubicOut });

  let root: HTMLButtonElement;

  function play() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    progress.set(0, { duration: 0 });
    progress.set(1, reduce ? { duration: 0 } : undefined);
  }

  $effect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  });

  function shown(index: number, value: number) {
    const start = index * 0.08;
    const local = Math.min(1, Math.max(0, (progress.current - start) / (1 - start * 1.5)));
    return Math.round(local * value);
  }

  function tone(value: number) {
    if (value >= 90) return { ring: "#0cce6b", text: "#3ee089", bg: "rgb(12 206 107 / 0.1)" };
    if (value >= 50) return { ring: "#ffa400", text: "#ffb733", bg: "rgb(255 164 0 / 0.1)" };
    return { ring: "#ff4e42", text: "#ff6b61", bg: "rgb(255 78 66 / 0.1)" };
  }
</script>

<button
  bind:this={root}
  type="button"
  onclick={play}
  title="Click to replay"
  class="group mx-auto grid w-fit cursor-pointer grid-cols-4 gap-x-4 rounded-lg text-left sm:gap-x-7">
  <span class="sr-only">Replay Lighthouse scores:</span>
  {#each scores as score, i (score.label)}
    {@const value = shown(i, score.value)}
    {@const colors = tone(score.value)}
    <span class="flex flex-col items-center gap-3 text-center">
      <span
        class="relative grid size-16 place-items-center transition-transform duration-200 group-hover:scale-105 sm:size-[76px]">
        <svg viewBox="0 0 80 80" class="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r={RADIUS} fill={colors.bg} />
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            stroke={colors.ring}
            stroke-width="5"
            stroke-linecap="round"
            stroke-dasharray={CIRCUMFERENCE}
            stroke-dashoffset={CIRCUMFERENCE * (1 - value / 100)}
          />
        </svg>
        <span class="relative font-mono text-lg tabular-nums sm:text-xl" style:color={colors.text}>
          {value}
        </span>
      </span>
      <span class="text-xs text-muted">{score.label}</span>
    </span>
  {/each}
</button>

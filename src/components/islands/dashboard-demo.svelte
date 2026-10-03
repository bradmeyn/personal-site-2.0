<script lang="ts">
  // A self-contained portfolio dashboard with generated data. No chart library:
  // the lines are SVG paths and the crosshair/tooltip are positioned HTML.

  type Point = { date: Date; portfolio: number; benchmark: number };

  const RANGES = [
    { id: "1M", days: 30 },
    { id: "6M", days: 182 },
    { id: "1Y", days: 365 },
    { id: "3Y", days: 1095 },
  ] as const;
  type RangeId = (typeof RANGES)[number]["id"];

  const ALLOCATION = [
    { label: "Australian shares", weight: 42, color: "#a59cff" },
    { label: "International shares", weight: 31, color: "#3fb4ec" },
    { label: "Fixed income", weight: 15, color: "#7dd8bc" },
    { label: "Cash", weight: 12, color: "#d9a36a" },
  ];

  // Deterministic random walk so the server and client render the same data.
  function seeded(seed: number) {
    return () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function generate(): Point[] {
    const rand = seeded(42);
    const end = new Date(Date.UTC(2026, 8, 30));
    const points: Point[] = [];
    let portfolio = 250_000;
    let benchmark = 250_000;
    for (let i = 1095; i >= 0; i--) {
      const shock = (rand() - 0.5) * 0.014;
      portfolio *= 1 + 0.00042 + shock + (rand() - 0.5) * 0.004;
      benchmark *= 1 + 0.00031 + shock * 0.9;
      points.push({
        date: new Date(end.getTime() - i * 86_400_000),
        portfolio,
        benchmark,
      });
    }
    return points;
  }

  const ALL = generate();
  const WIDTH = 600;
  const HEIGHT = 220;

  let range = $state<RangeId>("1Y");
  let showBenchmark = $state(true);
  let hoverIndex = $state<number | null>(null);
  let highlighted = $state<string | null>(null);

  const data = $derived(ALL.slice(-(RANGES.find((r) => r.id === range)!.days + 1)));

  const bounds = $derived.by(() => {
    const values = data.flatMap((p) => (showBenchmark ? [p.portfolio, p.benchmark] : [p.portfolio]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.12 || 1;
    return { min: min - pad, max: max + pad };
  });

  const x = (i: number) => (i / (data.length - 1)) * WIDTH;
  const y = (v: number) => HEIGHT - ((v - bounds.min) / (bounds.max - bounds.min)) * HEIGHT;

  function line(key: "portfolio" | "benchmark") {
    return data.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join("");
  }

  const portfolioPath = $derived(line("portfolio"));
  const benchmarkPath = $derived(line("benchmark"));
  const areaPath = $derived(`${portfolioPath}L${WIDTH},${HEIGHT}L0,${HEIGHT}Z`);

  const active = $derived(data[hoverIndex ?? data.length - 1]);
  const first = $derived(data[0]);
  const change = $derived(active.portfolio - first.portfolio);
  const changePct = $derived((change / first.portfolio) * 100);
  const vsBenchmark = $derived(
    changePct - ((active.benchmark - first.benchmark) / first.benchmark) * 100,
  );

  const money = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
  const dateFormat = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const signed = (n: number, suffix = "") => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1)}${suffix}`;

  function onPointer(event: PointerEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    hoverIndex = Math.round(ratio * (data.length - 1));
  }

  function onKey(event: KeyboardEvent) {
    const step = event.shiftKey ? 10 : 1;
    const current = hoverIndex ?? data.length - 1;
    if (event.key === "ArrowLeft") hoverIndex = Math.max(0, current - step);
    else if (event.key === "ArrowRight") hoverIndex = Math.min(data.length - 1, current + step);
    else if (event.key === "Escape") hoverIndex = null;
    else return;
    event.preventDefault();
  }

  function selectRange(id: RangeId) {
    range = id;
    hoverIndex = null;
  }
</script>

<div class="overflow-hidden rounded-xl border border-line-strong bg-surface text-[13px] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
    <p class="font-medium text-fg">Household portfolio</p>
    <div class="flex rounded-lg border border-line bg-bg/60 p-0.5" role="group" aria-label="Time range">
      {#each RANGES as r (r.id)}
        <button
          type="button"
          aria-pressed={range === r.id}
          onclick={() => selectRange(r.id)}
          class={[
            "rounded-md px-2.5 py-1 text-xs transition-colors",
            range === r.id ? "bg-overlay text-fg" : "text-faint hover:text-fg",
          ]}>
          {r.id}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-3 border-b border-line">
    <div class="px-4 py-3">
      <p class="text-[11px] text-faint">Value</p>
      <p class="mt-1 font-mono text-sm tabular-nums text-fg sm:text-lg">{money.format(active.portfolio)}</p>
    </div>
    <div class="border-l border-line px-4 py-3">
      <p class="text-[11px] text-faint">Change, {range}</p>
      <p class={["mt-1 whitespace-nowrap font-mono text-sm tabular-nums sm:text-lg", change >= 0 ? "text-[#7fd6a8]" : "text-[#ff8a80]"]}>
        {signed(changePct, "%")}
      </p>
    </div>
    <div class="border-l border-line px-4 py-3">
      <p class="text-[11px] text-faint">vs benchmark</p>
      <p class={["mt-1 whitespace-nowrap font-mono text-sm tabular-nums sm:text-lg", vsBenchmark >= 0 ? "text-[#7fd6a8]" : "text-[#ff8a80]"]}>
        {signed(vsBenchmark, " pts")}
      </p>
    </div>
  </div>

  <div class="px-4 pt-4">
    <div class="flex items-center gap-4 text-xs text-muted">
      <span class="inline-flex items-center gap-1.5">
        <span class="h-0.5 w-3 rounded-full bg-accent"></span> Portfolio
      </span>
      <button
        type="button"
        aria-pressed={showBenchmark}
        onclick={() => (showBenchmark = !showBenchmark)}
        class={["inline-flex items-center gap-1.5 transition-opacity hover:text-fg", !showBenchmark && "opacity-45"]}>
        <span class="h-0.5 w-3 rounded-full bg-[#a3afb3]"></span> Benchmark
      </button>
      <span class="ml-auto hidden text-faint sm:inline">{dateFormat.format(active.date)}</span>
    </div>

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      class="relative mt-3 h-48 cursor-crosshair touch-pan-y outline-none sm:h-56"
      role="img"
      tabindex="0"
      aria-label={`Portfolio value over ${range}. Use the arrow keys to inspect values.`}
      onpointermove={onPointer}
      onpointerdown={onPointer}
      onpointerleave={() => (hoverIndex = null)}
      onkeydown={onKey}
      onblur={() => (hoverIndex = null)}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" class="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="dash-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="#a59cff" stop-opacity="0.22" />
            <stop offset="1" stop-color="#a59cff" stop-opacity="0" />
          </linearGradient>
        </defs>
        {#each [0.25, 0.5, 0.75] as t (t)}
          <line x1="0" x2={WIDTH} y1={HEIGHT * t} y2={HEIGHT * t} stroke="rgb(255 255 255 / 0.06)" vector-effect="non-scaling-stroke" />
        {/each}
        <path d={areaPath} fill="url(#dash-area)" />
        {#if showBenchmark}
          <path d={benchmarkPath} fill="none" stroke="#a3afb3" stroke-opacity="0.55" stroke-width="1.25" stroke-dasharray="4 4" vector-effect="non-scaling-stroke" />
        {/if}
        <path d={portfolioPath} fill="none" stroke="#a59cff" stroke-width="1.75" vector-effect="non-scaling-stroke" />
      </svg>

      {#if hoverIndex !== null}
        {@const left = (hoverIndex / (data.length - 1)) * 100}
        <div class="pointer-events-none absolute inset-y-0 w-px bg-white/25" style:left={`${left}%`}></div>
        <div
          class="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-accent"
          style:left={`${left}%`}
          style:top={`${(y(active.portfolio) / HEIGHT) * 100}%`}>
        </div>
        <div
          class={[
            "pointer-events-none absolute top-2 whitespace-nowrap rounded-lg border border-line-strong bg-bg/90 px-3 py-2 text-xs backdrop-blur",
            left > 60 ? "-translate-x-[calc(100%+10px)]" : "translate-x-[10px]",
          ]}
          style:left={`${left}%`}>
          <p class="text-faint">{dateFormat.format(active.date)}</p>
          <p class="mt-1 font-mono tabular-nums text-fg">{money.format(active.portfolio)}</p>
          {#if showBenchmark}
            <p class="font-mono tabular-nums text-faint">{money.format(active.benchmark)}</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <div class="mt-4 border-t border-line px-4 py-4">
    <p class="text-xs text-muted">Allocation</p>
    <div class="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
      {#each ALLOCATION as a (a.label)}
        <span
          class="h-full transition-opacity duration-200"
          style:width={`${a.weight}%`}
          style:background={a.color}
          style:opacity={highlighted && highlighted !== a.label ? 0.25 : 1}>
        </span>
      {/each}
    </div>
    <ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
      {#each ALLOCATION as a (a.label)}
        <li>
          <button
            type="button"
            class="flex min-h-6 w-full items-center gap-2 rounded text-left text-xs text-muted transition-colors hover:text-fg focus-visible:text-fg"
            onpointerenter={() => (highlighted = a.label)}
            onpointerleave={() => (highlighted = null)}
            onfocus={() => (highlighted = a.label)}
            onblur={() => (highlighted = null)}>
            <span class="size-2 shrink-0 rounded-full" style:background={a.color}></span>
            <span class="truncate">{a.label}</span>
            <span class="ml-auto font-mono tabular-nums text-faint">{a.weight}%</span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>

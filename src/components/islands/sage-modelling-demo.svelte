<script lang="ts">
  // Sage's retirement modelling, with one live input. Ported from Sage's own
  // marketing mock: an illustrative household, real return, today's dollars.

  const START_AGE = 54;
  const END_AGE = 100;
  const RETIRE_AGE = 62;
  const START_BALANCE = 1_120_000;
  const BASE_CONTRIBUTIONS = 30_000;
  const SPENDING = 110_000;
  const RETURN = 0.04;

  type Point = { age: number; balance: number };

  function project(extra: number) {
    const points: Point[] = [];
    let balance = START_BALANCE;
    let lastsTo = END_AGE;
    for (let age = START_AGE; age <= END_AGE; age++) {
      points.push({ age, balance });
      if (balance <= 0) {
        lastsTo = Math.min(lastsTo, age - 1);
        continue;
      }
      const flow = age < RETIRE_AGE ? BASE_CONTRIBUTIONS + extra : -SPENDING;
      balance = Math.max(0, balance * (1 + RETURN) + flow);
    }
    const atRetirement = points.find((p) => p.age === RETIRE_AGE)!.balance;
    return { points, lastsTo, atRetirement };
  }

  const W = 480;
  const H = 200;
  const Y_MAX = 2_400_000;
  const x = (age: number) => ((age - START_AGE) / (END_AGE - START_AGE)) * W;
  const y = (bal: number) => H - (Math.min(bal, Y_MAX) / Y_MAX) * H;
  const linePath = (points: Point[]) =>
    points.map((p, i) => `${i ? "L" : "M"}${x(p.age).toFixed(1)},${y(p.balance).toFixed(1)}`).join(" ");
  const money = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`;

  let extra = $state(12_000);
  const current = project(0);
  const proposed = $derived(project(extra));
  const proposedLine = $derived(linePath(proposed.points));
  const currentLine = linePath(current.points);
</script>

<div class="p-4 sm:p-5">
  <div class="flex items-baseline justify-between gap-3 text-[13px]">
    <label for="sage-sacrifice" class="text-muted">Extra salary sacrifice until 62</label>
    <span class="font-mono tabular-nums text-fg">${extra.toLocaleString("en-AU")} a year</span>
  </div>
  <input
    id="sage-sacrifice"
    type="range"
    min="0"
    max="30000"
    step="1000"
    bind:value={extra}
    class="mt-3 w-full cursor-pointer accent-[var(--color-sage)]" />

  <svg
    viewBox={`0 0 ${W} ${H + 22}`}
    class="mt-5 w-full"
    role="img"
    aria-label={`Projected super balance. Current lasts to age ${current.lastsTo}, proposed to ${proposed.lastsTo >= END_AGE ? "beyond 100" : `age ${proposed.lastsTo}`}.`}>
    <defs>
      <linearGradient id="sage-model-fill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="var(--color-sage)" stop-opacity="0.22" />
        <stop offset="100%" stop-color="var(--color-sage)" stop-opacity="0" />
      </linearGradient>
    </defs>
    {#each [0.25, 0.5, 0.75] as f (f)}
      <line x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgb(255 255 255 / 0.06)" />
    {/each}
    <line x1={x(RETIRE_AGE)} x2={x(RETIRE_AGE)} y1="0" y2={H} stroke="#879499" stroke-opacity="0.5" stroke-dasharray="3 4" />
    <path d={`${proposedLine} L${W},${H} L0,${H} Z`} fill="url(#sage-model-fill)" />
    <path d={currentLine} fill="none" stroke="#879499" stroke-width="2" stroke-dasharray="5 5" />
    <path d={proposedLine} fill="none" stroke="var(--color-sage)" stroke-width="2.5" />
    <line x1="0" x2={W} y1={H} y2={H} stroke="rgb(255 255 255 / 0.1)" />
    {#each [54, 62, 70, 80, 90, 100] as age (age)}
      <text
        x={x(age)}
        y={H + 16}
        font-size="11"
        fill="#879499"
        text-anchor={age === 54 ? "start" : age === 100 ? "end" : "middle"}>
        {age === 62 ? "Retire 62" : age}
      </text>
    {/each}
  </svg>

  <dl class="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
    <div>
      <dt class="flex items-center gap-2 text-[11px] text-faint">
        <span class="h-0 w-4 border-t-2 border-dashed border-faint"></span>
        Current: lasts to
      </dt>
      <dd class="mt-1 font-mono text-xl tabular-nums text-fg">age {current.lastsTo}</dd>
    </div>
    <div>
      <dt class="flex items-center gap-2 text-[11px] text-faint">
        <span class="h-0 w-4 border-t-2 border-sage"></span>
        Proposed: lasts to
      </dt>
      <dd class="mt-1 font-mono text-xl tabular-nums text-sage">
        {proposed.lastsTo >= END_AGE ? "beyond 100" : `age ${proposed.lastsTo}`}
      </dd>
      <dd class="text-[11px] tabular-nums text-faint">
        {money(proposed.atRetirement)} at 62, +{money(proposed.atRetirement - current.atRetirement)}
      </dd>
    </div>
  </dl>
</div>

<script lang="ts">
  // What a yearly fee does to a long-term investment. Illustrative only:
  // $10,000 invested at the start of each year, a fixed return before fees,
  // no tax and no inflation.

  const YEARS = 30;
  const CONTRIBUTION = 10_000;
  const RETURN_PCT = 7;
  const RETURN = RETURN_PCT / 100;
  const LOW_FEE = 0.001; // a broad index fund

  type Point = { year: number; balance: number };

  function project(fee: number): Point[] {
    const points: Point[] = [{ year: 0, balance: 0 }];
    let balance = 0;
    for (let year = 1; year <= YEARS; year++) {
      balance = (balance + CONTRIBUTION) * (1 + RETURN - fee);
      points.push({ year, balance });
    }
    return points;
  }

  const W = 480;
  const H = 200;
  const low = project(LOW_FEE);
  const Y_MAX = Math.ceil(low[YEARS].balance / 200_000) * 200_000;
  const x = (year: number) => (year / YEARS) * W;
  const y = (bal: number) => H - (bal / Y_MAX) * H;
  const line = (points: Point[]) =>
    points.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)},${y(p.balance).toFixed(1)}`).join(" ");
  const money = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
  const short = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`);

  const uid = $props.id();

  // Basis points, so the slider steps cleanly: 10 = 0.1%.
  let feeBps = $state(150);
  const fee = $derived(feeBps / 10_000);
  const chosen = $derived(project(fee));
  const chosenLine = $derived(line(chosen));
  const lost = $derived(low[YEARS].balance - chosen[YEARS].balance);
  const lowLine = line(low);
  const invested = CONTRIBUTION * YEARS;
</script>

<figure class="not-prose my-10 rounded-xl border border-line-strong bg-surface p-5 sm:p-7">
  <figcaption class="text-sm text-muted">
    $10,000 a year for {YEARS} years, at {RETURN_PCT}% a year before fees
  </figcaption>

  <div class="mt-6 flex items-baseline justify-between gap-3 text-sm">
    <label for={`${uid}-fee`} class="text-muted">Yearly fee</label>
    <span class="font-mono tabular-nums text-fg">{(feeBps / 100).toFixed(2)}%</span>
  </div>
  <input
    id={`${uid}-fee`}
    type="range"
    min="10"
    max="200"
    step="5"
    bind:value={feeBps}
    class="mt-3 w-full cursor-pointer accent-[var(--color-accent)]" />

  <svg
    viewBox={`0 0 ${W} ${H + 22}`}
    class="mt-6 w-full"
    role="img"
    aria-label={`After ${YEARS} years: ${money(low[YEARS].balance)} with a 0.1% fee, ${money(chosen[YEARS].balance)} with a ${(feeBps / 100).toFixed(2)}% fee.`}>
    <defs>
      <linearGradient id={`${uid}-fill`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.22" />
        <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0" />
      </linearGradient>
    </defs>
    {#each [0.25, 0.5, 0.75] as f (f)}
      <line x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgb(255 255 255 / 0.06)" />
      <text x="0" y={H * f - 5} font-size="11" fill="#879499">{short(Y_MAX * (1 - f))}</text>
    {/each}
    <path d={`${chosenLine} L${W},${H} L0,${H} Z`} fill={`url(#${uid}-fill)`} />
    <path d={lowLine} fill="none" stroke="#879499" stroke-width="2" stroke-dasharray="5 5" />
    <path d={chosenLine} fill="none" stroke="var(--color-accent)" stroke-width="2.5" />
    <line x1="0" x2={W} y1={H} y2={H} stroke="rgb(255 255 255 / 0.1)" />
    {#each [0, 10, 20, 30] as year (year)}
      <text
        x={x(year)}
        y={H + 16}
        font-size="11"
        fill="#879499"
        text-anchor={year === 0 ? "start" : year === YEARS ? "end" : "middle"}>
        {year === 0 ? "Year 0" : year}
      </text>
    {/each}
  </svg>

  <dl class="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3">
    <div>
      <dt class="flex items-center gap-2 text-xs text-faint">
        <span class="h-0 w-4 border-t-2 border-dashed border-faint"></span>
        0.10% fee
      </dt>
      <dd class="mt-1 font-mono text-lg tabular-nums text-fg">{money(low[YEARS].balance)}</dd>
    </div>
    <div>
      <dt class="flex items-center gap-2 text-xs text-faint">
        <span class="h-0 w-4 border-t-2 border-accent"></span>
        {(feeBps / 100).toFixed(2)}% fee
      </dt>
      <dd class="mt-1 font-mono text-lg tabular-nums text-accent">{money(chosen[YEARS].balance)}</dd>
    </div>
    <div class="col-span-2 sm:col-span-1">
      <dt class="text-xs text-faint">Lost to the higher fee</dt>
      <dd class="mt-1 font-mono text-lg tabular-nums text-fg">{lost > 0 ? money(lost) : "$0"}</dd>
    </div>
  </dl>

  <p class="mt-5 text-xs leading-relaxed text-faint">
    Illustrative only: {money(invested)} invested in total, at the start of each year, with a
    fixed {RETURN_PCT}% return before fees and no tax or inflation. Real returns vary year to year.
  </p>
</figure>

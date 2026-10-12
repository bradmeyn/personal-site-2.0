<script lang="ts">
  // A small, self-contained CRM: search and filter clients, open one, move it
  // through the pipeline and add file notes. Everything lives in component
  // state; nothing is saved. Illustrative clients only.

  const STAGES = ["Prospect", "Fact find", "Strategy", "Advice", "Ongoing"] as const;
  type Stage = (typeof STAGES)[number];

  type Note = { text: string; when: string };
  type Client = {
    id: string;
    name: string;
    initials: string;
    tone: string;
    summary: string;
    stage: Stage;
    reviewDue: boolean;
    value: string;
    notes: Note[];
  };

  const FILTERS = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "review", label: "Review due" },
    { id: "prospect", label: "Prospects" },
  ] as const;
  type FilterId = (typeof FILTERS)[number]["id"];

  let clients = $state<Client[]>([
    {
      id: "whitfield",
      name: "Margaret & Paul Whitfield",
      initials: "MW",
      tone: "#437b64",
      summary: "Couple, both 54. Retiring at 62.",
      stage: "Advice",
      reviewDue: false,
      value: "$1.84M",
      notes: [
        { text: "Agreed $12,000 a year salary sacrifice between them.", when: "3 Sep" },
        { text: "Fact find submitted through the client portal.", when: "21 Aug" },
      ],
    },
    {
      id: "cho",
      name: "Helena Cho",
      initials: "HC",
      tone: "#6e64bc",
      summary: "Single, 41. Business owner, paying down debt.",
      stage: "Ongoing",
      reviewDue: true,
      value: "$920k",
      notes: [{ text: "Annual review booked for Tuesday.", when: "2 Oct" }],
    },
    {
      id: "okafor",
      name: "The Okafor Group",
      initials: "OG",
      tone: "#9c6432",
      summary: "Family trust. Two directors, three beneficiaries.",
      stage: "Ongoing",
      reviewDue: true,
      value: "$3.2M",
      notes: [{ text: "Fee consent link sent.", when: "29 Sep" }],
    },
    {
      id: "patel",
      name: "Raj & Priya Patel",
      initials: "RP",
      tone: "#367ba8",
      summary: "Couple, 36 and 34. First home, new baby.",
      stage: "Strategy",
      reviewDue: false,
      value: "$410k",
      notes: [{ text: "Insurance needs analysis in progress.", when: "24 Sep" }],
    },
    {
      id: "byrne",
      name: "Sarah Byrne",
      initials: "SB",
      tone: "#a65673",
      summary: "Single, 29. Referred by Helena Cho.",
      stage: "Prospect",
      reviewDue: false,
      value: "$85k",
      notes: [{ text: "Intro call booked.", when: "Today" }],
    },
  ]);

  // Sidebar items: icon paths are 24×24 strokes.
  const NAV = [
    { label: "Dashboard", icon: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" },
    { label: "Clients", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
    { label: "Pipeline", icon: "M3 3h5v18H3zM10 3h5v12h-5zM17 3h4v8h-4z" },
    { label: "Tasks", icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
    { label: "Documents", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5" },
  ];

  let query = $state("");
  let filter = $state<FilterId>("all");
  let selectedId = $state("whitfield");
  let draft = $state("");

  const visible = $derived(
    clients.filter((c) => {
      const matches = c.name.toLowerCase().includes(query.trim().toLowerCase());
      if (!matches) return false;
      if (filter === "active") return c.stage !== "Prospect";
      if (filter === "review") return c.reviewDue;
      if (filter === "prospect") return c.stage === "Prospect";
      return true;
    }),
  );

  const selected = $derived(clients.find((c) => c.id === selectedId) ?? clients[0]);
  const stageIndex = $derived(STAGES.indexOf(selected.stage));

  function addNote(event: SubmitEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    selected.notes.unshift({ text, when: "Just now" });
    draft = "";
  }
</script>

<div
  class="overflow-hidden rounded-xl border border-line-strong bg-surface text-[13px] sm:shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
  <div class="grid sm:grid-cols-[8.5rem_minmax(0,1fr)]">
    <!-- App sidebar (from 640px) -->
    <nav class="hidden flex-col border-r border-line bg-bg/40 p-2.5 sm:flex" aria-label="CRM sections">
      <p class="flex items-center gap-2 px-2 pb-3 pt-1 text-xs font-semibold text-fg">
        <span class="grid size-5 place-items-center rounded-md bg-accent text-[10px] text-bg">A</span>
        Acme Advice
      </p>
      {#each NAV as item (item.label)}
        <span
          class={[
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
            item.label === "Clients" ? "bg-white/[0.06] text-fg" : "text-muted",
          ]}
          aria-current={item.label === "Clients" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" class="size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d={item.icon} />
          </svg>
          {item.label}
        </span>
      {/each}
    </nav>

    <div class="min-w-0">
  <div class="flex items-center gap-3 border-b border-line px-4 py-3">
    <p class="font-medium text-fg">Clients</p>
    <span class="text-xs text-faint">{visible.length} of {clients.length}</span>
  </div>

  <div class="grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
    <!-- List -->
    <div class="border-b border-line md:border-b-0 md:border-r lg:border-b lg:border-r-0 xl:border-b-0 xl:border-r">
      <div class="space-y-2.5 p-3">
        <label class="block">
          <span class="sr-only">Search clients</span>
          <input
            type="search"
            bind:value={query}
            placeholder="Search clients"
            class="w-full rounded-md border border-line-strong bg-bg/60 px-2.5 py-1.5 text-[13px] text-fg placeholder:text-faint focus:border-accent/60 focus:outline-none" />
        </label>
        <div class="flex flex-wrap gap-1" role="group" aria-label="Filter clients">
          {#each FILTERS as f (f.id)}
            <button
              type="button"
              aria-pressed={filter === f.id}
              onclick={() => (filter = f.id)}
              class={[
                "rounded-md px-2 py-1 text-xs transition-colors",
                filter === f.id ? "bg-overlay text-fg" : "text-faint hover:text-fg",
              ]}>
              {f.label}
            </button>
          {/each}
        </div>
      </div>

      <ul class="max-h-56 overflow-y-auto md:max-h-none lg:max-h-48 xl:max-h-none" aria-label="Clients">
        {#each visible as c (c.id)}
          <li>
            <button
              type="button"
              onclick={() => (selectedId = c.id)}
              aria-current={c.id === selected.id ? "true" : undefined}
              class={[
                "flex w-full items-center gap-2.5 border-t border-line px-3 py-2.5 text-left transition-colors",
                c.id === selected.id ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
              ]}>
              <span
                class="grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white"
                style:background={c.tone}>
                {c.initials}
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate font-medium text-fg">{c.name}</span>
                <span class="block truncate text-xs text-faint">{c.stage}</span>
              </span>
              {#if c.reviewDue}
                <span class="size-1.5 shrink-0 rounded-full bg-[#ffb733]" title="Review due"></span>
                <span class="sr-only">Review due</span>
              {/if}
            </button>
          </li>
        {:else}
          <li class="border-t border-line px-3 py-6 text-center text-xs text-faint">
            No clients match. Try another name or filter.
          </li>
        {/each}
      </ul>
    </div>

    <!-- Record -->
    <div class="min-w-0 p-4">
      <div class="flex items-start gap-3">
        <span
          class="grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
          style:background={selected.tone}>
          {selected.initials}
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-base font-medium leading-tight text-fg">{selected.name}</p>
          <p class="mt-0.5 text-xs text-faint">{selected.summary}</p>
        </div>
        <div class="text-right">
          <p class="text-[11px] text-faint">Net worth</p>
          <p class="font-mono text-sm tabular-nums text-fg">{selected.value}</p>
        </div>
      </div>

      <div class="mt-5">
        <p class="text-xs text-muted">Stage</p>
        <ol class="mt-2 grid grid-cols-5 gap-1" aria-label="Pipeline stage">
          {#each STAGES as stage, i (stage)}
            <li>
              <button
                type="button"
                onclick={() => (selected.stage = stage)}
                aria-current={stage === selected.stage ? "step" : undefined}
                class="group w-full text-left">
                <span
                  class={[
                    "block h-1.5 rounded-full transition-colors",
                    i <= stageIndex ? "bg-accent" : "bg-white/[0.08] group-hover:bg-white/[0.16]",
                  ]}></span>
                <span
                  class={[
                    "mt-1.5 block truncate text-[11px]",
                    stage === selected.stage ? "text-fg" : "text-faint",
                  ]}>{stage}</span>
              </button>
            </li>
          {/each}
        </ol>
      </div>

      <form class="mt-5 flex gap-2" onsubmit={addNote}>
        <label class="min-w-0 flex-1">
          <span class="sr-only">Add a file note for {selected.name}</span>
          <input
            bind:value={draft}
            placeholder="Add a file note"
            class="w-full rounded-md border border-line-strong bg-bg/60 px-2.5 py-1.5 text-[13px] text-fg placeholder:text-faint focus:border-accent/60 focus:outline-none" />
        </label>
        <button
          type="submit"
          class="rounded-md bg-fg px-3 py-1.5 text-xs font-medium text-bg transition-colors hover:bg-accent">
          Add note
        </button>
      </form>

      <p class="mt-5 text-xs text-muted">File notes</p>
      <ol class="mt-2 space-y-2" aria-live="polite">
        {#each selected.notes as note, i (note.when + note.text + i)}
          <li class="flex gap-2 text-xs leading-relaxed text-muted">
            <span class="mt-[5px] size-1.5 shrink-0 rounded-full bg-accent/70"></span>
            <span>
              <span class="block">{note.text}</span>
              <span class="block text-[11px] text-faint">{note.when}</span>
            </span>
          </li>
        {/each}
      </ol>
    </div>
  </div>
    </div>
  </div>
</div>

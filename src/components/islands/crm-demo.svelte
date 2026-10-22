<script lang="ts">
  // A working copy of Sage's clients list inside Sage's app frame: search,
  // sort, open a client's record, or switch to Modelling in the sidebar.
  // Illustrative clients only.
  import SageModellingDemo from "./sage-modelling-demo.svelte";

  type Status = "PROSPECT" | "ACTIVE" | "INACTIVE" | "FORMER";
  type Client = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    occupation: string;
    status: Status;
    since: string;
  };

  const STATUSES: { value: Status; label: string }[] = [
    { value: "PROSPECT", label: "Prospect" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "FORMER", label: "Former" },
  ];

  const CLIENTS: Client[] = [
    { firstName: "Margaret", lastName: "Whitfield", email: "margaret.w@outlook.com", phone: "0412 384 920", occupation: "School principal", status: "ACTIVE", since: "Mar 2019" },
    { firstName: "Paul", lastName: "Whitfield", email: "paul.whitfield@gmail.com", phone: "0423 118 457", occupation: "Civil engineer", status: "ACTIVE", since: "Mar 2019" },
    { firstName: "Helena", lastName: "Cho", email: "dr.cho@clinic.com.au", phone: "0401 552 309", occupation: "GP", status: "ACTIVE", since: "Aug 2016" },
    { firstName: "Raj", lastName: "Patel", email: "raj.patel@icloud.com", phone: "0435 760 214", occupation: "Accountant", status: "ACTIVE", since: "Nov 2021" },
    { firstName: "Priya", lastName: "Patel", email: "priya.patel@icloud.com", phone: "0435 760 215", occupation: "Pharmacist", status: "ACTIVE", since: "Nov 2021" },
    { firstName: "Sarah", lastName: "Byrne", email: "sarah.byrne@gmail.com", phone: "0418 902 377", occupation: "Nurse unit manager", status: "PROSPECT", since: "" },
    { firstName: "Graham", lastName: "Doyle", email: "g.doyle@bigpond.com", phone: "0402 663 158", occupation: "Retired", status: "ACTIVE", since: "Feb 2014" },
    { firstName: "Elaine", lastName: "Doyle", email: "elaine.doyle@bigpond.com", phone: "0402 663 159", occupation: "Retired", status: "ACTIVE", since: "Feb 2014" },
    { firstName: "Tom", lastName: "Nguyen", email: "tom.nguyen@proton.me", phone: "0447 281 640", occupation: "Software developer", status: "PROSPECT", since: "" },
    { firstName: "Amara", lastName: "Okafor", email: "amara@okaforgroup.com.au", phone: "0409 334 812", occupation: "Business owner", status: "INACTIVE", since: "Jun 2018" },
    { firstName: "Leon", lastName: "Fischer", email: "leon.fischer@gmail.com", phone: "0451 207 993", occupation: "Electrician", status: "FORMER", since: "Jan 2015" },
  ];

  // Sage's sidebar groups; a group without a heading stands alone. Icon paths are 24×24 strokes.
  const NAV: { group?: string; items: { label: string; icon: string }[] }[] = [
    {
      group: "Work",
      items: [
        { label: "Dashboard", icon: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" },
        { label: "Clients", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
        { label: "Tasks", icon: "M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13" },
        { label: "Pipeline", icon: "M2 7h20v14H2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
        { label: "Modelling", icon: "M3 3v18h18M7 14l4-4 4 4 5-6" },
      ],
    },
    {
      group: "Practice",
      items: [
        { label: "Compliance", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" },
        { label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" },
      ],
    },
  ];

  const STATUS_CLASS: Record<Status, string> = {
    ACTIVE: "bg-sage/15 text-sage",
    PROSPECT: "bg-white/[0.08] text-fg",
    INACTIVE: "bg-white/[0.05] text-muted",
    FORMER: "bg-white/[0.05] text-muted",
  };
  const statusLabel = (s: Status) => STATUSES.find((x) => x.value === s)!.label;

  // Which screen is showing, and which client is open.
  let view = $state<"clients" | "client" | "modelling">("clients");
  let openEmail = $state<string | null>(null);
  const openClient = $derived(CLIENTS.find((c) => c.email === openEmail) ?? null);

  let search = $state("");
  let order = $state<"asc" | "desc">("asc");

  // A few believable recent events per status, so each record has something to read.
  const ACTIVITY: Record<Status, { what: string; when: string }[]> = {
    ACTIVE: [
      { what: "Annual review booked", when: "Tue 14 Oct" },
      { what: "Ongoing fee consent signed online", when: "2 Oct" },
      { what: "Fact find updated through the client portal", when: "21 Aug" },
    ],
    PROSPECT: [
      { what: "Intro call booked", when: "Thu 16 Oct" },
      { what: "Fact find link sent", when: "Today" },
    ],
    INACTIVE: [
      { what: "Annual review overdue", when: "3 weeks" },
      { what: "Reminder email sent", when: "29 Sep" },
    ],
    FORMER: [{ what: "Service agreement ended", when: "Jan 2025" }],
  };

  function open(c: Client) {
    openEmail = c.email;
    view = "client";
  }

  const activeNav = $derived(view === "modelling" ? "Modelling" : "Clients");

  function matches(c: Client, q: string) {
    if (!q) return true;
    const digits = q.replace(/\s/g, "");
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (digits.length > 0 && c.phone.replace(/\s/g, "").includes(digits))
    );
  }

  const rows = $derived.by(() => {
    const q = search.trim().toLowerCase();
    return CLIENTS.filter((c) => matches(c, q)).sort((a, b) => {
      const cmp = a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
      return order === "asc" ? cmp : -cmp;
    });
  });

</script>

<div
  class="overflow-hidden rounded-xl border border-line-strong bg-surface text-[13px] sm:shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
  <div class="grid sm:grid-cols-[8.5rem_minmax(0,1fr)]">
    <!-- Sage's sidebar (from 640px) -->
    <nav class="hidden flex-col gap-3 border-r border-line bg-bg/40 p-2.5 sm:flex" aria-label="Sage sections">
      <p class="flex items-center gap-1.5 px-2 pt-1 text-sm font-medium text-fg">
        <svg viewBox="-10 -10 295 315" class="size-4 shrink-0" aria-hidden="true">
          <g fill="var(--color-sage)">
            <path d="M157 0H272C240 50 190 118 112 125C70 129 40 150 17 182C8 155 10 110 40 70C70 30 110 0 157 0Z" />
            <path d="M0 295C30 240 80 175 160 165C210 160 240 180 275 182C255 240 200 295 122 295Z" />
          </g>
        </svg>
        Sage
      </p>
      {#each NAV as section (section.items[0].label)}
        <div>
          {#if section.group}<p class="px-2 pb-1 text-[10px] text-faint">{section.group}</p>{/if}
          {#each section.items as item (item.label)}
            {@const clickable = item.label === "Clients" || item.label === "Modelling"}
            {@const active = item.label === activeNav}
            <svelte:element
              this={clickable ? "button" : "span"}
              type={clickable ? "button" : undefined}
              onclick={clickable ? () => (view = item.label === "Modelling" ? "modelling" : "clients") : undefined}
              class={[
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                active ? "bg-white/[0.06] text-fg" : clickable ? "text-muted hover:bg-white/[0.04] hover:text-fg" : "text-faint",
              ]}
              aria-current={active ? "page" : undefined}>
              <svg viewBox="0 0 24 24" class="size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d={item.icon} />
              </svg>
              {item.label}
            </svelte:element>
          {/each}
        </div>
      {/each}
    </nav>

    <!-- Main area: the clients list, one client's record, or modelling -->
    <div class="min-w-0 p-4">
      {#if view === "modelling"}
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-lg font-medium leading-tight text-fg">Modelling</p>
            <p class="mt-0.5 text-xs text-muted">Retirement, Margaret &amp; Paul Whitfield</p>
          </div>
        </div>
        <div class="-mx-4 -mb-4 mt-2 sm:-mx-5">
          <SageModellingDemo />
        </div>
      {:else if view === "client" && openClient}
        {@const c = openClient}
        <button type="button" onclick={() => (view = "clients")} class="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg">
          <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Clients
        </button>
        <div class="mt-3 flex items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-sage/15 text-xs font-semibold text-sage">
            {c.firstName[0]}{c.lastName[0]}
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-lg font-medium leading-tight text-fg">{c.firstName} {c.lastName}</p>
            <p class="mt-0.5 truncate text-xs text-muted">{c.occupation}</p>
          </div>
          <span class={["whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_CLASS[c.status]]}>{statusLabel(c.status)}</span>
        </div>

        <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-line p-3">
          <div class="min-w-0"><dt class="text-[11px] text-faint">Email</dt><dd class="mt-0.5 truncate text-fg">{c.email}</dd></div>
          <div><dt class="text-[11px] text-faint">Phone</dt><dd class="mt-0.5 font-mono tabular-nums text-fg">{c.phone}</dd></div>
          <div><dt class="text-[11px] text-faint">Occupation</dt><dd class="mt-0.5 text-fg">{c.occupation}</dd></div>
          <div><dt class="text-[11px] text-faint">Client since</dt><dd class="mt-0.5 text-fg">{c.since || "Not yet a client"}</dd></div>
        </dl>

        <p class="mt-4 text-xs font-medium text-muted">Recent activity</p>
        <ol class="mt-2 space-y-2">
          {#each ACTIVITY[c.status] as a (a.what)}
            <li class="flex gap-2 text-xs leading-relaxed text-muted">
              <span class="mt-[5px] size-1.5 shrink-0 rounded-full bg-sage"></span>
              <span><span class="text-fg">{a.what}</span><span class="text-faint">, {a.when}</span></span>
            </li>
          {/each}
        </ol>

        <button type="button" onclick={() => (view = "modelling")} class="mt-4 inline-flex items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-1.5 text-xs text-fg transition-colors hover:border-sage/50 hover:text-sage">
          <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 3v18h18M7 14l4-4 4 4 5-6" /></svg>
          Open retirement modelling
        </button>
      {:else}
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-lg font-medium leading-tight text-fg">Clients</p>
          <p class="mt-0.5 text-xs text-muted">{rows.length} {rows.length === 1 ? "client" : "clients"}</p>
        </div>
        <span class="rounded-md bg-sage px-2.5 py-1.5 text-xs font-medium text-bg">Add client</span>
      </div>

      <label class="relative mt-4 block max-w-xs">
        <span class="sr-only">Search clients</span>
        <svg viewBox="0 0 24 24" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>
        </svg>
        <input
          type="search"
          bind:value={search}
          placeholder="Search by name, email or phone..."
          class="w-full rounded-md border border-line-strong bg-bg/60 py-1.5 pl-8 pr-2.5 text-[13px] text-fg placeholder:text-faint focus:border-sage/60 focus:outline-none" />
      </label>


      <div class="mt-4 max-h-[19rem] overflow-y-auto rounded-lg border border-line">
        <table class="w-full text-left">
          <thead class="sticky top-0 bg-surface text-[11px] text-faint">
            <tr class="border-b border-line">
              <th class="px-3 py-2 font-normal" aria-sort={order === "asc" ? "ascending" : "descending"}>
                <button type="button" onclick={() => (order = order === "asc" ? "desc" : "asc")} class="inline-flex items-center gap-1 hover:text-fg">
                  Client <span aria-hidden="true">{order === "asc" ? "↑" : "↓"}</span>
                </button>
              </th>
              <th class="px-2 py-2 font-normal">Status</th>
              <th class="hidden px-2 py-2 font-normal md:table-cell lg:hidden">Occupation</th>
              <th class="hidden px-3 py-2 font-normal sm:table-cell">Client since</th>
            </tr>
          </thead>
          <tbody>
            {#each rows as c (c.email)}
              <tr class="relative cursor-pointer border-b border-line last:border-0 hover:bg-white/[0.04]">
                <td class="px-3 py-2">
                  <button
                    type="button"
                    onclick={() => open(c)}
                    class="flex min-w-0 items-center gap-2.5 text-left after:absolute after:inset-0 after:content-['']"
                    aria-label={`Open ${c.firstName} ${c.lastName}`}>
                    <span class="grid size-7 shrink-0 place-items-center rounded-full bg-sage/10 text-[10px] font-semibold text-sage">
                      {c.firstName[0]}{c.lastName[0]}
                    </span>
                    <span class="min-w-0">
                      <span class="block truncate font-medium text-fg">{c.firstName} {c.lastName}</span>
                      <span class="block truncate text-[11px] text-faint">{c.email}</span>
                    </span>
                  </button>
                </td>
                <td class="px-2 py-2">
                  <span class={["whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_CLASS[c.status]]}>{statusLabel(c.status)}</span>
                </td>
                <td class="hidden truncate px-2 py-2 text-muted md:table-cell lg:hidden">{c.occupation}</td>
                <td class="hidden whitespace-nowrap px-3 py-2 text-muted sm:table-cell">{c.since || "—"}</td>
              </tr>
            {:else}
              <tr>
                <td colspan="4" class="px-3 py-8 text-center text-xs text-faint">No clients match that search.</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {/if}
    </div>
  </div>
</div>

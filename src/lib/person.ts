import { SITE } from "@/constants/site";

export const PERSON_ID = `${SITE.url}/#person`;

/**
 * The one description of you that every page's structured data points at.
 * Both name forms are listed so searches for either resolve to this person.
 */
export const PERSON = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.name,
  alternateName: [SITE.shortName],
  givenName: "Bradley",
  familyName: "Meyn",
  url: SITE.url,
  jobTitle: "Full-stack developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location.locality,
    addressRegion: SITE.location.region,
    addressCountry: SITE.location.country,
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Monash University" },
    { "@type": "CollegeOrUniversity", name: "University of Newcastle" },
  ],
  sameAs: [...SITE.profiles],
  knowsAbout: ["TypeScript", "SvelteKit", "Svelte", "React", "TanStack Start", "Astro", "PostgreSQL"],
} as const;

/** A short reference to the person, for authors and publishers. */
export const PERSON_REF = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: `${SITE.url}/about/`,
} as const;

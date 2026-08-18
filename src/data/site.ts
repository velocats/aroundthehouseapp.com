export const siteUrl = 'https://aroundthehouseapp.com/';
export const appStoreUrl = 'https://apps.apple.com/us/app/around-the-house-binder/id6789646793';
export const supportEmail = 'support@quiettoolsapps.com';

export type PageRef = {
  /** Path with leading and trailing slash, e.g. '/home-maintenance-app/' */
  path: string;
  /** Short label used in navigation and internal link lists */
  label: string;
  /** One-line description used on the Resources index and in link cards */
  blurb: string;
  /** Sitemap hints */
  changefreq: 'weekly' | 'monthly' | 'yearly';
  priority: number;
  lastmod: string;
};

/** Product / use-case landing pages. Order is the order shown in the footer. */
export const landingPages: PageRef[] = [
  {
    path: '/home-maintenance-app/',
    label: 'Home maintenance app',
    blurb: 'How Around The House organizes maintenance, repairs, documents, and the details that are easy to forget.',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: '2026-08-18'
  },
  {
    path: '/home-maintenance-tracker/',
    label: 'Home maintenance tracker',
    blurb: 'Track what is due, mark it complete, and keep the completion in your history.',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: '2026-08-18'
  },
  {
    path: '/home-maintenance-records/',
    label: 'Maintenance records & repair history',
    blurb: 'Keep a long-term record of what was repaired, when, by whom, and what it cost.',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: '2026-08-18'
  },
  {
    path: '/digital-home-binder/',
    label: 'Digital home binder',
    blurb: 'Manuals, receipts, warranties, and important home information, filed with the item they belong to.',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: '2026-08-18'
  },
  {
    path: '/home-maintenance-reminders/',
    label: 'Maintenance reminders',
    blurb: 'Recurring reminders for filters, inspections, and seasonal work, with overdue work kept visible.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-08-18'
  },
  {
    path: '/new-homeowner-app/',
    label: 'For new homeowners',
    blurb: 'Learn a house as you go: shutoffs, filter sizes, install dates, and who to call.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-08-18'
  },
  {
    path: '/home-inventory-app/',
    label: 'Home inventory',
    blurb: 'Record what you own and keep photos, receipts, and serial numbers attached to each item.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-08-18'
  }
];

export type Article = PageRef & {
  title: string;
  /** ISO date shown on the page and used for Article schema */
  published: string;
  updated: string;
};

/** Resource articles. Order is the order shown on /resources/. */
export const articles: Article[] = [
  {
    path: '/resources/how-to-keep-track-of-home-maintenance/',
    label: 'How to keep track of home maintenance',
    title: 'How to Keep Track of Home Maintenance Without Losing the History',
    blurb:
      'Paper, calendars, spreadsheets, reminder apps, and dedicated tools — what each one is good at, and where each one tends to fall down.',
    published: '2026-08-18',
    updated: '2026-08-18',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-08-18'
  },
  {
    path: '/resources/home-maintenance-records-to-keep/',
    label: 'What home maintenance records should you keep?',
    title: 'What Home Maintenance Records Should You Keep?',
    blurb:
      'A practical list of what is worth writing down after a repair or service visit — and what you can safely skip.',
    published: '2026-08-18',
    updated: '2026-08-18',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-08-18'
  },
  {
    path: '/resources/how-to-create-a-digital-home-binder/',
    label: 'How to create a digital home binder',
    title: 'How to Create a Digital Home Binder',
    blurb:
      'What belongs in a home binder, how to organize it so it stays usable, and how to build it a little at a time.',
    published: '2026-08-18',
    updated: '2026-08-18',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-08-18'
  }
];

/** Pages that existed before the SEO build-out. */
export const corePages: PageRef[] = [
  { path: '/', label: 'Home', blurb: '', changefreq: 'weekly', priority: 1.0, lastmod: '2026-08-18' },
  { path: '/screenshots/', label: 'Screenshots', blurb: '', changefreq: 'monthly', priority: 0.8, lastmod: '2026-07-19' },
  { path: '/resources/', label: 'Resources', blurb: '', changefreq: 'monthly', priority: 0.8, lastmod: '2026-08-18' },
  { path: '/support/', label: 'Support', blurb: '', changefreq: 'monthly', priority: 0.6, lastmod: '2026-07-18' },
  { path: '/privacy/', label: 'Privacy', blurb: '', changefreq: 'yearly', priority: 0.4, lastmod: '2026-07-18' },
  { path: '/terms/', label: 'Terms', blurb: '', changefreq: 'yearly', priority: 0.4, lastmod: '2026-07-18' }
];

/** Every indexable URL, used to build /sitemap.xml. */
export const allPages: PageRef[] = [...corePages, ...landingPages, ...articles];

/** Look up a page by path, for building internal link lists by reference. */
export function page(path: string): PageRef {
  const found = allPages.find((p) => p.path === path);
  if (!found) throw new Error(`Unknown page path in link list: ${path}`);
  return found;
}

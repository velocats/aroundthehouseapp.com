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
  },
  {
    path: '/home-warranty-tracker/',
    label: 'Home warranty tracker',
    blurb: 'Keep warranty dates, receipts, documents, and covered items together before coverage expires.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/appliance-maintenance-records/',
    label: 'Appliance maintenance records',
    blurb: 'Record model numbers, manuals, service history, parts, providers, costs, and recurring care by appliance.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/home-handoff-report/',
    label: 'Home handoff report',
    blurb: 'Bring assets, maintenance history, reminders, documents, warranties, and costs into a useful home summary.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/private-home-maintenance-app/',
    label: 'Private home maintenance app',
    blurb: 'Organize home records on Apple devices without creating another company account.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/homezada-alternative/',
    label: 'HomeZada alternative',
    blurb: 'Compare a broad cloud home-management platform with a focused, private Apple home-record app.',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/household-management-app/',
    label: 'Household management app',
    blurb: 'Keep the practical operating details of a home—items, work, documents, costs, and contacts—in one private place.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/home-repair-cost-tracker/',
    label: 'Home repair cost tracker',
    blurb: 'Connect repair and maintenance spending to the item, work, provider, invoice, and date behind each cost.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/home-contractor-records/',
    label: 'Contractor and home service records',
    blurb: 'Remember who worked on the home, what they did, what it cost, and where the invoice was filed.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/home-document-organizer/',
    label: 'Home document organizer',
    blurb: 'File manuals, receipts, warranties, invoices, and photos with the appliance or system each document describes.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
  },
  {
    path: '/home-maintenance-calendar/',
    label: 'Home maintenance calendar',
    blurb: 'See upcoming, overdue, and completed home maintenance without separating the calendar from the item history.',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2026-09-09'
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
    path: '/resources/water-heater-maintenance-checklist/',
    label: 'Water heater maintenance checklist',
    title: 'Water Heater Maintenance Checklist for Homeowners',
    blurb: 'Inspect leaks, identify the heater, follow its flushing schedule, and know which gas, electrical, and pressure-valve work belongs with a professional.',
    published: '2026-09-09', updated: '2026-09-09', changefreq: 'yearly', priority: 0.7, lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-test-sump-pump/',
    label: 'How to test a sump pump',
    title: 'How to Test a Sump Pump Before the Next Storm',
    blurb: 'Check the discharge, pit, float, pump cycle, and backup system before heavy rain exposes a problem.',
    published: '2026-09-09', updated: '2026-09-09', changefreq: 'yearly', priority: 0.7, lastmod: '2026-09-09'
  },
  {
    path: '/resources/annual-hvac-maintenance-checklist/',
    label: 'Annual HVAC maintenance checklist',
    title: 'Annual HVAC Maintenance Checklist: Homeowner and Contractor Tasks',
    blurb: 'Separate safe homeowner checks from the electrical, refrigerant, combustion, and performance work a qualified HVAC contractor should complete.',
    published: '2026-09-09', updated: '2026-09-09', changefreq: 'yearly', priority: 0.7, lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-clean-gutters-safely/',
    label: 'How to clean gutters safely',
    title: 'How to Clean Gutters Safely—and When Not to Use a Ladder',
    blurb: 'Plan the job around ladder safety, power lines, weather, drainage, and the conditions that make professional cleaning the better choice.',
    published: '2026-09-09', updated: '2026-09-09', changefreq: 'yearly', priority: 0.7, lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-often-to-test-smoke-alarms/',
    label: 'How often to test smoke alarms',
    title: 'How Often Should You Test and Replace Smoke Alarms?',
    blurb: 'A practical schedule for monthly tests, model-specific battery care, ten-year replacement, and a room-by-room alarm record.',
    published: '2026-09-09', updated: '2026-09-09', changefreq: 'yearly', priority: 0.7, lastmod: '2026-09-09'
  },
  {
    path: '/resources/seasonal-home-maintenance-checklist/',
    label: 'Seasonal home maintenance checklist',
    title: 'Seasonal Home Maintenance Checklist That Builds a Useful History',
    blurb: 'A focused spring, summer, fall, and winter inspection plan organized around safety, water, HVAC, and the exterior envelope.',
    published: '2026-09-09', updated: '2026-09-09', changefreq: 'yearly', priority: 0.7, lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-change-carbon-monoxide-detector-battery/',
    label: 'How to change a carbon monoxide detector battery',
    title: 'How to Change a Carbon Monoxide Detector Battery Safely',
    blurb:
      'A model-aware checklist for replacing the battery, testing the alarm, recognizing end-of-life signals, and recording the work.',
    published: '2026-09-09',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-clean-bathroom-exhaust-fan/',
    label: 'How to clean a bathroom exhaust fan',
    title: 'How to Clean a Bathroom Exhaust Fan',
    blurb:
      'Safely remove dust from the grille and accessible fan components, then check whether the fan is moving humid air effectively.',
    published: '2026-09-09',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-often-to-change-furnace-filter/',
    label: 'How often to change a furnace filter',
    title: 'How Often Should You Change a Furnace Filter?',
    blurb:
      'Use the filter, system manual, household conditions, and a monthly inspection to choose a replacement schedule that fits your home.',
    published: '2026-09-09',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-clean-refrigerator-coils/',
    label: 'How to clean refrigerator coils',
    title: 'How to Clean Refrigerator Coils Without Damaging the Appliance',
    blurb:
      'First determine whether your model needs coil cleaning, then follow a careful power-off, vacuum, and inspection routine.',
    published: '2026-09-09',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-clean-dryer-vent/',
    label: 'How to clean a dryer vent',
    title: 'How to Clean a Dryer Vent and Know When to Call a Professional',
    blurb:
      'Clean the accessible connection and exhaust path safely, watch for warning signs, and keep a record of the work.',
    published: '2026-09-09',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-keep-track-of-home-maintenance/',
    label: 'How to keep track of home maintenance',
    title: 'How to Keep Track of Home Maintenance Without Losing the History',
    blurb:
      'Paper, calendars, spreadsheets, reminder apps, and dedicated tools — what each one is good at, and where each one tends to fall down.',
    published: '2026-08-18',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/resources/home-maintenance-records-to-keep/',
    label: 'What home maintenance records should you keep?',
    title: 'What Home Maintenance Records Should You Keep?',
    blurb:
      'A practical list of what is worth writing down after a repair or service visit — and what you can safely skip.',
    published: '2026-08-18',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  },
  {
    path: '/resources/how-to-create-a-digital-home-binder/',
    label: 'How to create a digital home binder',
    title: 'How to Create a Digital Home Binder',
    blurb:
      'What belongs in a home binder, how to organize it so it stays usable, and how to build it a little at a time.',
    published: '2026-08-18',
    updated: '2026-09-09',
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: '2026-09-09'
  }
];

/** Pages that existed before the SEO build-out. */
export const corePages: PageRef[] = [
  { path: '/', label: 'Home', blurb: '', changefreq: 'weekly', priority: 1.0, lastmod: '2026-08-18' },
  { path: '/screenshots/', label: 'Screenshots', blurb: '', changefreq: 'monthly', priority: 0.8, lastmod: '2026-07-19' },
  { path: '/pricing/', label: 'Pricing', blurb: 'Monthly and lifetime purchase options for Around The House.', changefreq: 'monthly', priority: 0.8, lastmod: '2026-08-18' },
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

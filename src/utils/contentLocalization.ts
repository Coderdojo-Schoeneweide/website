import { configuration, type Locale } from '@/i18n.ts';

// Minimal shape required by the localization helpers.
// Content collection entries include many more fields, but only `id` is required here.
type EntryWithId = { id: string;[key: string]: any };

// Locale aliases allow mapping multiple URL/content prefixes to one locale.
// Right now aliases are 1:1 (`de` -> `de`, etc.), but this keeps extension easy.
// Future improvement: derive this from a single i18n source-of-truth to avoid duplication.
const localeAliases: Record<Locale, string[]> = {
    de: ['de'],
    en: ['en'],
    ar: ['ar'],
};

const allLocalePrefixes = [...new Set(Object.values(localeAliases).flat())];

// Matches leading locale prefixes in content IDs.
// Examples: `de/workshops/foo`, `en/blog/post`, and locale-only IDs like `ar`.
const localePrefixPattern = new RegExp(
    `^(?:${allLocalePrefixes.join('|')})(?:/|$)`,
);

// Converts a matched ID prefix into a configured locale.
// Falls back to default locale if the prefix is unknown.
function getLocaleFromPrefix(prefix: string): Locale {
    const normalizedPrefix = prefix.replace(/\/$/, '');

    for (const locale of configuration.locales) {
        if (localeAliases[locale].includes(normalizedPrefix)) {
            return locale;
        }
    }

    return configuration.defaultLocale;
}

// Resolves any optional locale input to a supported locale.
// Invalid or missing values always fall back to the default locale.
export function resolveLocale(locale?: string): Locale {
    return locale && configuration.locales.includes(locale as Locale) ?
        (locale as Locale)
        : configuration.defaultLocale;
}

// Extracts the locale from a content entry ID.
// If no locale prefix is encoded in the ID, default locale is assumed.
export function getContentLocale(id: string): Locale {
    const prefixMatch = id.match(localePrefixPattern);
    if (prefixMatch) {
        return getLocaleFromPrefix(prefixMatch[0]);
    }

    return configuration.defaultLocale;
}

// Normalizes content IDs so localized variants share the same base ID.
// Steps:
// 1) remove locale prefix (`de/...` -> `...`)
// 2) remove trailing `/index`
// 3) normalize empty result to `index`
//
// Future improvement: if Astro exposes a stable helper for this exact transform,
// prefer that over custom regex/path normalization.
export function getBaseContentId(id: string): string {
    let baseId = id;

    if (localePrefixPattern.test(baseId)) {
        baseId = baseId.replace(localePrefixPattern, '').replace(/^\//, '');
    }

    if (baseId.endsWith('/index')) {
        baseId = baseId.slice(0, -('/index'.length));
    }

    return baseId || 'index';
}

// Builds a route slug from a normalized ID by taking the last path segment.
// Example: `workshops/python-astropi` -> `python-astropi`.
export function getRouteSlug(id: string): string {
    const baseId = getBaseContentId(id);
    const segments = baseId.split('/').filter(Boolean);
    return (segments.at(-1) ?? baseId) || 'index';
}

// Normalizes slugs to ASCII-safe paths for static hosts/CDNs that may not
// reliably serve UTF-8 directory names.
export function toAsciiSlug(slug: string): string {
    const germanCharMap: Record<string, string> = {
        ä: 'ae',
        ö: 'oe',
        ü: 'ue',
        Ä: 'ae',
        Ö: 'oe',
        Ü: 'ue',
        ß: 'ss',
    };

    const replaced = slug.replace(/[äöüÄÖÜß]/g, (char) => germanCharMap[char] ?? char);

    const normalized = replaced
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return normalized || 'index';
}

// Selects one best-matching localized entry per base ID.
// Scoring strategy:
// - 3: exact requested locale
// - 2: default locale fallback
// - 0: all other locales ignored
//
// Future improvement: optionally log fallback decisions in development mode,
// so missing translations are easier to spot.
export function selectLocalizedEntries(
    entries: EntryWithId[],
    locale?: string,
): EntryWithId[] {
    const selectedLocale = resolveLocale(locale);
    const selectedByBaseId = new Map<string, { entry: EntryWithId; score: number }>();

    for (const entry of entries) {
        const entryLocale = getContentLocale(entry.id);
        const baseId = getBaseContentId(entry.id);

        if (!baseId) {
            continue;
        }

        const score =
            entryLocale === selectedLocale ?
                3
                : entryLocale === configuration.defaultLocale ?
                    2
                    : 0;

        if (score === 0) {
            continue;
        }

        const current = selectedByBaseId.get(baseId);
        if (!current || score > current.score) {
            selectedByBaseId.set(baseId, { entry, score });
        }
    }

    return [...selectedByBaseId.values()].map(({ entry }) => entry);
}

// Returns a localized entry by normalized content ID.
// Uses the same locale/fallback selection rules as `selectLocalizedEntries`.
export function findLocalizedEntryById(
    entries: EntryWithId[],
    id: string,
    locale?: string,
): EntryWithId | undefined {
    const normalizedId = id.toLowerCase();
    return selectLocalizedEntries(entries, locale).find(
        (entry) => getBaseContentId(entry.id).toLowerCase() === normalizedId,
    );
}

// Returns a localized entry by route slug.
// Useful for routes where only the final slug segment is available.
export function findLocalizedEntryBySlug(
    entries: EntryWithId[],
    slug: string,
    locale?: string,
): EntryWithId | undefined {
    const normalizedSlug = slug.toLowerCase();
    return selectLocalizedEntries(entries, locale).find(
        (entry) => getRouteSlug(entry.id).toLowerCase() === normalizedSlug,
    );
}

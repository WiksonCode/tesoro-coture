import type { Haljina, InventarStavka } from '@/types'

/** Kanonski domen (root tesoro.rs redirektuje na www). */
export const SITE_URL = 'https://www.tesoro.rs'

/** NAP / kontakt podaci salona — jedini izvor istine za schema markup. */
export const BUSINESS = {
  name: 'TESORO Couture',
  legalName: 'TESORO Couture',
  description:
    'Salon ženskih haljina u Beogradu — vjenčane, koktel, svečane i maturske haljine. Izrada po mjeri i rezervacija termina.',
  email: 'info@tesorocouture.rs',
  telephone: '+381654033795',
  address: {
    street: 'Jurija Gagarina 151a',
    locality: 'Beograd',
    postalCode: '11070',
    country: 'RS',
  },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '12:00', closes: '19:00' },
    { days: ['Saturday'], opens: '10:00', closes: '16:00' },
  ],
  sameAs: [
    'https://www.instagram.com/tesoro_couture',
    'https://www.facebook.com/share/18fjyBJJMM/',
    'https://www.tiktok.com/@tesorocouture',
  ],
  logo: `${SITE_URL}/tesoro2-logo.png`,
} as const

/** Gradi apsolutni URL nad kanonskim domenom. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString()
}

/** Organization schema — ide na sve stranice preko layout-a. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS.name,
    url: SITE_URL,
    logo: BUSINESS.logo,
    email: BUSINESS.email,
    telephone: BUSINESS.telephone,
    sameAs: [...BUSINESS.sameAs],
  }
}

/** LocalBusiness (ClothingStore) schema — za local pack / Google Maps. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${SITE_URL}/#localbusiness`,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    image: BUSINESS.logo,
    logo: BUSINESS.logo,
    email: BUSINESS.email,
    telephone: BUSINESS.telephone,
    priceRange: '$$',
    currenciesAccepted: 'RSD, EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    openingHoursSpecification: BUSINESS.openingHours.map((oh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: oh.days,
      opens: oh.opens,
      closes: oh.closes,
    })),
    sameAs: [...BUSINESS.sameAs],
  }
}

/** Najniža/najviša aktivna cijena u RSD iz inventara. */
function cijenaRaspon(inventar: InventarStavka[] = []) {
  const dostupne = inventar.filter((i) => !i.arhivirana)
  const cijene = dostupne.map((i) =>
    i.na_akciji && i.cijena_akcija_rsd != null ? i.cijena_akcija_rsd : i.cijena_rsd
  )
  if (cijene.length === 0) return null
  return { low: Math.min(...cijene), high: Math.max(...cijene), broj: cijene.length }
}

/** Product schema za stranicu haljine. */
export function productSchema(haljina: Haljina) {
  const raspon = cijenaRaspon(haljina.inventar)
  const url = absoluteUrl(`/haljina/${haljina.slug}`)
  const naStanju = (haljina.inventar ?? []).some((i) => !i.arhivirana && i.dostupna)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: haljina.naziv_sr,
    description: haljina.opis_sr ?? undefined,
    image: haljina.slike?.length ? haljina.slike : undefined,
    sku: haljina.id,
    category: haljina.kategorija?.naziv_sr,
    url,
    brand: { '@type': 'Brand', name: BUSINESS.name },
    ...(raspon
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'RSD',
            lowPrice: raspon.low,
            highPrice: raspon.high,
            offerCount: raspon.broj,
            availability: naStanju
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url,
            seller: { '@type': 'Organization', name: BUSINESS.name },
          },
        }
      : {}),
  }
}

/** BreadcrumbList schema. `stavke` je niz {ime, path}. */
export function breadcrumbSchema(stavke: { ime: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: stavke.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.ime,
      item: absoluteUrl(s.path),
    })),
  }
}

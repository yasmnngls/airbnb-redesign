/**
 * Mock earnings data for the estimator. Rates are illustrative only. They are
 * not Airbnb data and only exist so the interaction feels real.
 */

export type PlaceType = 'entire' | 'room'

export type City = {
  id: string
  name: string
  region: string
  /** Base nightly rate (USD) for a 1-bedroom entire place */
  base: number
  /** Rotates the stylised map so each city looks a little different */
  mapAngle: number
}

export const CITIES: City[] = [
  { id: 'lisbon', name: 'Lisbon', region: 'Portugal', base: 118, mapAngle: 0 },
  { id: 'new-york', name: 'New York', region: 'United States', base: 214, mapAngle: 28 },
  { id: 'mexico-city', name: 'Mexico City', region: 'Mexico', base: 76, mapAngle: -18 },
  { id: 'tokyo', name: 'Tokyo', region: 'Japan', base: 132, mapAngle: 12 },
  { id: 'london', name: 'London', region: 'United Kingdom', base: 186, mapAngle: -32 },
  { id: 'cape-town', name: 'Cape Town', region: 'South Africa', base: 92, mapAngle: 40 },
  { id: 'paris', name: 'Paris', region: 'France', base: 168, mapAngle: -8 },
  { id: 'sydney', name: 'Sydney', region: 'Australia', base: 172, mapAngle: 22 },
  { id: 'manila', name: 'Manila', region: 'Philippines', base: 58, mapAngle: -24 },
  { id: 'barcelona', name: 'Barcelona', region: 'Spain', base: 141, mapAngle: 6 },
]

export function nightlyRate(city: City, type: PlaceType, bedrooms: number): number {
  if (type === 'room') return Math.round(city.base * 0.48)
  return Math.round(city.base * (1 + 0.34 * (bedrooms - 1)))
}

/** Small deterministic PRNG so pins stay put for the same inputs */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

export type Pin = { id: string; x: number; y: number; price: number }

/** Comparable listings around the city centre, positioned as % of the map */
export function nearbyPins(city: City, type: PlaceType, bedrooms: number, count = 9): Pin[] {
  const rand = mulberry32(hash(`${city.id}-${type}-${bedrooms}`))
  const rate = nightlyRate(city, type, bedrooms)
  const pins: Pin[] = []
  let tries = 0
  while (pins.length < count && tries < 200) {
    tries++
    const angle = rand() * Math.PI * 2
    const dist = 16 + rand() * 30
    const x = 50 + Math.cos(angle) * dist
    const y = 50 + Math.sin(angle) * dist * 0.85
    if (x < 9 || x > 91 || y < 10 || y > 90) continue
    // Keep pins from overlapping each other's price labels
    if (pins.some((p) => Math.abs(p.x - x) < 15 && Math.abs(p.y - y) < 9)) continue
    pins.push({ id: `${city.id}-${pins.length}`, x, y, price: Math.round(rate * (0.75 + rand() * 0.55)) })
  }
  return pins
}

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

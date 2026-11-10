import axios from "axios";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "SpotCube/1.0 (spotcube1@gmail.com)";
const MAX_ATTEMPTS = 5;
const DELAY_MS = 1100; // Nominatim allows about 1 request per second

// what OpenStreetMap says it matched → our precision level
const FINE_TYPES = new Set([
  "building", "house", "amenity", "shop", "office",
  "tourism", "leisure", "craft", "historic",
]);
const AREA_TYPES = new Set([
  "road", "highway", "residential", "neighbourhood", "suburb", "quarter",
  "hamlet", "borough", "city_district", "industrial", "commercial",
  "retail", "locality",
]);
const CITY_TYPES = new Set([
  "city", "town", "village", "municipality", "county", "state_district", "district",
]);
const STATE_TYPES = new Set(["state", "region", "province"]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// decides the precision from what was really matched
const classify = (hit, fallbackLevel) => {
  const type = hit.addresstype || hit.type;

  if (FINE_TYPES.has(type)) return "address";
  if (AREA_TYPES.has(type)) return "area";
  if (CITY_TYPES.has(type)) return "city";
  if (STATE_TYPES.has(type)) return "state";
  if (type === "country") return "country";

  return fallbackLevel;
};

// pulls a city/town name out of the matched result, if there is one
const extractCity = (hit) => {
  const a = hit.address || {};
  return (
    a.city || a.town || a.village || a.municipality ||
    a.city_district || a.county || a.state_district || null
  );
};

const searchOnce = async (q, country) => {
  const params = { q, format: "json", limit: 1, addressdetails: 1 };

  if (String(country || "").toLowerCase() === "nigeria") {
    params.countrycodes = "ng";
  }

  const res = await axios.get(NOMINATIM_URL, {
    params,
    headers: { "User-Agent": USER_AGENT },
    timeout: 8000,
  });

  return res.data?.[0] || null;
};

/**
 * Finds coordinates as precisely as possible, then falls back step by step:
 * exact address → nearby area → city/town → state → country.
 *
 * Returns { geoLocation, geoPrecision, geoMatchedQuery, city } or null.
 * geoPrecision: "address" | "area" | "city" | "state" | "country"
 */
export const geocodeAddress = async ({ location, state, country = "Nigeria" }) => {
  const parts = String(location || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  // 1. queries built from the address, most specific first.
  //    the last comma part is usually the city/town ("12 Allen Ave, Ikeja")
  let locationCandidates = parts.map((_, i) => ({
    q: [...parts.slice(i), state, country].filter(Boolean).join(", "),
    level: i === 0 ? "address" : i === parts.length - 1 ? "city" : "area",
  }));

  // keep the full address and the two broadest address queries if there are too many
  const maxLocation = MAX_ATTEMPTS - 2; // leave room for the state and country attempts
  if (locationCandidates.length > maxLocation) {
    locationCandidates = [
      locationCandidates[0],
      ...locationCandidates.slice(-(maxLocation - 1)),
    ];
  }

  // 2. then the state, then the country
  const candidates = [...locationCandidates];
  if (state) candidates.push({ q: `${state}, ${country}`, level: "state" });
  if (country) candidates.push({ q: country, level: "country" });

  // remove duplicate queries
  const seen = new Set();
  const queue = candidates.filter((c) => {
    if (seen.has(c.q)) return false;
    seen.add(c.q);
    return true;
  });

  for (let i = 0; i < queue.length; i++) {
    const { q, level } = queue[i];

    try {
      const hit = await searchOnce(q, country);

      if (hit) {
        const geoPrecision = classify(hit, level);

        return {
          geoLocation: {
            type: "Point",
            coordinates: [parseFloat(hit.lon), parseFloat(hit.lat)], // [longitude, latitude]
          },
          geoPrecision,
          geoMatchedQuery: q,
          // a city name only makes sense when we matched at city level or finer
          city: ["address", "area", "city"].includes(geoPrecision)
            ? extractCity(hit)
            : null,
        };
      }
    } catch (err) {
      console.error(`Geocoding error for "${q}":`, err.message);
    }

    if (i < queue.length - 1) await sleep(DELAY_MS);
  }

  return null; // nothing found, even at country level
};
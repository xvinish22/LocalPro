
// Defines the allowed service areas for the Pune launch.
// Each area has a name and a bounding box [minLat, minLng, maxLat, maxLng].
export const PUNE_LOCATIONS = {
  KATRAJ: {
    name: 'Katraj',
    bounds: [18.448, 73.845, 18.470, 73.865],
  },
  KONDHWA: {
    name: 'Kondhwa',
    bounds: [18.470, 73.880, 18.495, 73.905],
  },
  BIBWEWADI: {
    name: 'Bibwewadi',
    bounds: [18.468, 73.855, 18.490, 73.875],
  },
};

/**
 * Validates if a given latitude and longitude are within any of the allowed Pune areas.
 * @param latitude - The latitude to check.
 * @param longitude - The longitude to check.
 * @returns An object with `isAllowed` (boolean) and `areaName` (string | null).
 */
export const validatePuneLocation = (
  latitude: number,
  longitude: number
): { isAllowed: boolean; areaName: string | null } => {
  for (const key in PUNE_LOCATIONS) {
    const location = PUNE_LOCATIONS[key as keyof typeof PUNE_LOCATIONS];
    const [minLat, minLng, maxLat, maxLng] = location.bounds;

    if (
      latitude >= minLat &&
      latitude <= maxLat &&
      longitude >= minLng &&
      longitude <= maxLng
    ) {
      return { isAllowed: true, areaName: location.name };
    }
  }

  return { isAllowed: false, areaName: null };
};

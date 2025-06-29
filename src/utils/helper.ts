import { dict } from '@/lib/translation/dict';
import { DictLanguages } from '@/types/dict';

export function getText(lang: DictLanguages) {
  // Default to English if translation missing
  return {
    ...dict.en,
    ...dict[lang],
  };
}

export const capitalize = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Calculate distance between two points in kilometers using Haversine formula
export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 -
    Math.cos(((lat2 - lat1) * Math.PI) / 180) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      (1 - Math.cos(((lon2 - lon1) * Math.PI) / 180))) /
      2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

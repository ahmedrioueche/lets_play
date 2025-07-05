export type Language = 'en' | 'fr' | 'es' | 'de' | 'it';

export interface LocationI {
  cords?: {
    lat: number;
    lng: number;
  };
  address: string;
}

export type Language = 'en' | 'fr' | 'ar';

export interface LocationI {
  cords?: {
    lat: number;
    lng: number;
  };
  address: string;
}

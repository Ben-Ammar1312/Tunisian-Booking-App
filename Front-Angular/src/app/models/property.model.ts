export interface Property {
  id: number;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  type: string;
  isAvailable: boolean;
  proprietaireId: number;
  firstImage?: string;
}


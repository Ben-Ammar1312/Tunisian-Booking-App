// src/app/models/property.model.ts
export interface Property {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  description: string;
  type: string;
  isAvailable: boolean;

  proprietaireId: number;
  // Add other relevant fields
}

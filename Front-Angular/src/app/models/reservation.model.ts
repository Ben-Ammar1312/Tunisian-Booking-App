export interface PropertyImage {
  id: number;
  url: string;
}

export interface Property {
  id: number;
  name: string;
  location: string;
  description?: string;
  pricePerNight: number;
  type: string;
  images: PropertyImage[];
}

export interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  property: Property;
}

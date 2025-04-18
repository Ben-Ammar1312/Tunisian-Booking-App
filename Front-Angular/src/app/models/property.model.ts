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

  // ─── Amenities ──────────────────────────────────────────
  wifi:                    boolean;
  kitchen:                 boolean;
  pool:                    boolean;
  hotTub:                  boolean;
  airConditioning:         boolean;
  heating:                 boolean;
  washer:                  boolean;
  dryer:                   boolean;
  freeParkingOnPremises:   boolean;
  bbqGrill:                boolean;
  gym:                     boolean;
  petsAllowed:             boolean;
  smokeAlarm:              boolean;
  carbonMonoxideAlarm:     boolean;
  firstAidKit:             boolean;
  hairDryer:               boolean;
  coffeeMaker:             boolean;
}


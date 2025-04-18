namespace Darna.DTOs
{
    public class PropertyDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Location { get; set; } = "";
        public string? Description { get; set; }
        public decimal PricePerNight { get; set; }
        public string Type { get; set; } = "";
        public int ProprietaireId { get; set; }
        public List<string>? Images { get; set; }

        // Amenities
        public bool Wifi { get; set; }
        public bool Kitchen { get; set; }
        public bool Pool { get; set; }
        public bool HotTub { get; set; }
        public bool AirConditioning { get; set; }
        public bool Heating { get; set; }
        public bool Washer { get; set; }
        public bool Dryer { get; set; }
        public bool FreeParkingOnPremises { get; set; }
        public bool BbqGrill { get; set; }
        public bool Gym { get; set; }
        public bool PetsAllowed { get; set; }
        public bool SmokeAlarm { get; set; }
        public bool CarbonMonoxideAlarm { get; set; }
        public bool FirstAidKit { get; set; }
        public bool HairDryer { get; set; }
        public bool CoffeeMaker { get; set; }
        public bool IsAvailable { get; set; }
    }

}

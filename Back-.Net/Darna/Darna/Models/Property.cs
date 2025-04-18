using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Darna.Models
{
    public class Property
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public decimal PricePerNight { get; set; }

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // Apartment, Maison, Condo, Villa

        public ICollection<PropertyImage>? Images { get; set; }


        public bool IsAvailable { get; set; } = true;

        public int ProprietaireId { get; set; }

        [ForeignKey("ProprietaireId")]
        public Proprietaire? Proprietaire { get; set; }

        public ICollection<Reservation>? Reservations { get; set; }

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
    }
}

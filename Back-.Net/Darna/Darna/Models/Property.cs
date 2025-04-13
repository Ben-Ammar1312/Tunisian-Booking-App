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

        public bool IsAvailable { get; set; } = true;

        public int ProprietaireId { get; set; }

        [ForeignKey("ProprietaireId")]
        public Proprietaire? Proprietaire { get; set; }

        public ICollection<Reservation>? Reservations { get; set; }
    }
}

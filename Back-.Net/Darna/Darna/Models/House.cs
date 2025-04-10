using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Darna.Models
{
    public class House
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

        public bool IsAvailable { get; set; } = true;

        public int ProprietaireId { get; set; }

        [ForeignKey("ProprietaireId")]
        public Proprietaire? Proprietaire { get; set; }

        public ICollection<Reservation>? Reservations { get; set; }
    }
}

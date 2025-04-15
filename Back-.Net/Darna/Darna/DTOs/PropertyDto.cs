namespace Darna.DTOs
{
    public class PropertyDto
    {
        public string Name { get; set; } = "";
        public string Location { get; set; } = "";
        public string? Description { get; set; }
        public decimal PricePerNight { get; set; }
        public string Type { get; set; } = "";
        public int ProprietaireId { get; set; }
        public List<string>? Images { get; set; }
    }

}

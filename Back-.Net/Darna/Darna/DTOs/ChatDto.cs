// Darna/DTOs/ChatDto.cs
namespace Darna.DTOs
{
    public class ChatDto
    {
        public string UserInput { get; set; } = "";
        public int TopK { get; set; } = 5;
    }
}

// Darna/DTOs/SearchDto.cs
namespace Darna.DTOs
{
    public class SearchDto
    {
        public string Query { get; set; } = "";
        public int TopK { get; set; } = 5;
    }
}
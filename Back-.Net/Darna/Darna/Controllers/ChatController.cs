// Darna/Controllers/ChatController.cs
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Darna.DTOs;
using Darna.Services;

namespace Darna.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ListingSearchService _search;
        private readonly ChatService _chat;

        public ChatController(ListingSearchService search, ChatService chat)
            => (_search, _chat) = (search, chat);

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatDto dto)
        {
            // 1) RAG search
            var hits = await _search.SearchAsync(dto.UserInput, dto.TopK);

            // 2) build optional context block
            string contextBlock = "";
            if (hits.Any())
            {
                var items = hits.Select(p =>
                    $"{p.Name}: {p.Description}\nLieu: {p.Location}, Prix: {p.PricePerNight} TND");
                contextBlock =
                  "Voici des annonces pertinentes de la base :\n\n"
                  + string.Join("\n\n", items)
                  + "\n\n";
            }

            // 3) system prompt
            var systemPrompt =
                "Tu es DarnaBot, un assistant de location et vous parlez directement a nos cliens pour leur donner des informations sur notre site et listings  " +
                "Utilise le contexte base de données uniquement s’il est pertinent,  " +
                "sinon répond grâce à ta connaissance générale du domaine. ";

            // 4) user prompt
            var userPrompt = contextBlock
                           + $"Question: {dto.UserInput}";

            // 5) chat/completions call
            var answer = await _chat.GetReplyAsync(systemPrompt, userPrompt);

            return Ok(new { reply = answer });
        }
    }
}
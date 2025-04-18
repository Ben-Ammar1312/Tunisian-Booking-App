// Darna/Services/ChatService.cs
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace Darna.Services
{
    public class ChatService
    {
        private readonly HttpClient _http;

        public ChatService(HttpClient http) => _http = http;

        /// <summary>
        /// Sends a chat‑style payload to /v1/chat/completions
        /// </summary>
        public async Task<string> GetReplyAsync(string systemPrompt, string userPrompt)
        {
            var payload = new
            {
                model = "mistral-7b-instruct-v0.3",  // whichever LL model you’ve loaded
                messages = new[]
                {
                   
                    new { role = "user",      content = userPrompt   }
                },
                max_tokens = 1024,
                temperature = 0.7f
            };

            // this will POST to BASEADDRESS + "v1/chat/completions"
            var res = await _http.PostAsJsonAsync("v1/chat/completions", payload);

            if (!res.IsSuccessStatusCode)
            {
                var err = await res.Content.ReadAsStringAsync();
                throw new HttpRequestException(
                    $"LM Studio chat error {(int)res.StatusCode}: {err}");
            }

            using var doc = await res.Content.ReadFromJsonAsync<JsonDocument>();
            var content = doc!
                .RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return content ?? "";
        }
    }
}
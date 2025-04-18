using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Darna.Models;

namespace Darna.Services
{
    public class ListingSearchService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly HttpClient _lmClient;
        private float[][] _embeddings = Array.Empty<float[]>();
        private Property[] _properties = Array.Empty<Property>();

        public ListingSearchService(
            IServiceScopeFactory scopeFactory,
            IHttpClientFactory httpFactory)
        {
            _scopeFactory = scopeFactory;
            // this matches the named client in Program.cs
            _lmClient = httpFactory.CreateClient("lmstudio");
        }

        /// <summary>
        /// Load all your properties, embed them in batch,
        /// and stash vectors + props in memory.
        /// </summary>
        public async Task BuildIndexAsync()
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider
                          .GetRequiredService<ApplicationDbContext>();

            var all = await db.Properties
                              .AsNoTracking()
                              .ToListAsync();

            var texts = all
                .Select(p => $"{p.Name}. {p.Description}. Lieu: {p.Location}. Prix: {p.PricePerNight} TND")
                .ToArray();

            var embedReq = new
            {
                model = "nomic-embed-text-v1.5",
                input = texts
            };

            // **relative** path here
            var res = await _lmClient.PostAsJsonAsync("v1/embeddings", embedReq);
            res.EnsureSuccessStatusCode();

            using var doc = await res.Content.ReadFromJsonAsync<JsonDocument>();
            var data = doc.RootElement
                          .GetProperty("data")
                          .EnumerateArray();

            _embeddings = data
              .Select(x => x.GetProperty("embedding")
                            .EnumerateArray()
                            .Select(e => e.GetSingle())
                            .ToArray())
              .ToArray();

            _properties = all.ToArray();
        }

        /// <summary>
        /// Embed the query → cosine against your in‑memory index → top K.
        /// </summary>
        public async Task<Property[]> SearchAsync(string query, int topK = 5)
        {
            if (_embeddings.Length == 0)
                throw new InvalidOperationException("Index not yet built.");

            var qr = new
            {
                model = "nomic-embed-text-v1.5",
                input = new[] { query }
            };
            var r = await _lmClient.PostAsJsonAsync("v1/embeddings", qr);
            r.EnsureSuccessStatusCode();

            using var j = await r.Content.ReadFromJsonAsync<JsonDocument>();
            var qvec = j.RootElement
                        .GetProperty("data")[0]
                        .GetProperty("embedding")
                        .EnumerateArray()
                        .Select(e => e.GetSingle())
                        .ToArray();

            // cosine similarity
            var best = _embeddings
                .Select((vec, i) => (score: Cosine(qvec, vec), idx: i))
                .OrderByDescending(x => x.score)
                .Take(topK)
                .Select(x => _properties[x.idx])
                .ToArray();

            return best;
        }

        private static float Cosine(float[] a, float[] b)
        {
            float dot = 0, ma = 0, mb = 0;
            for (int i = 0; i < a.Length; i++)
            {
                dot += a[i] * b[i];
                ma += a[i] * a[i];
                mb += b[i] * b[i];
            }
            return dot / (MathF.Sqrt(ma) * MathF.Sqrt(mb) + 1e-8f);
        }
    }
}
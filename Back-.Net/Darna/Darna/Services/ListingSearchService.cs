using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Darna.Models;
using Darna.DTOs;
using System.Text.RegularExpressions;

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
public async Task<PropertyDto[]> SearchAsync(string query, int topK = 5)
{
    // ───────────────────────────────────────────────────────────────
    // 0️⃣  Extract numeric price filters from the query
    //     (very small regex – covers 99 % of casual queries)
    // ───────────────────────────────────────────────────────────────
    decimal? minPrice = null, maxPrice = null;
    var m = Regex.Match(query, @"(?i)(under|below|less\s+than)\s+(\d+)");
    if (m.Success)            maxPrice = decimal.Parse(m.Groups[2].Value);
    m = Regex.Match(query, @"(?i)(over|above|more\s+than)\s+(\d+)");
    if (m.Success)            minPrice = decimal.Parse(m.Groups[2].Value);
    m = Regex.Match(query, @"(?i)between\s+(\d+)\s+and\s+(\d+)");
    if (m.Success)
    {
        minPrice = decimal.Parse(m.Groups[1].Value);
        maxPrice = decimal.Parse(m.Groups[2].Value);
    }

    //----------------------------------------------------------------
    // 1️⃣  Pull the *candidate* set FROM SQL using the numeric filter
    //----------------------------------------------------------------
    using var scope = _scopeFactory.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var candidatesQ = db.Properties.AsNoTracking();
    if (minPrice is not null) candidatesQ = candidatesQ.Where(p => p.PricePerNight >= minPrice);
    if (maxPrice is not null) candidatesQ = candidatesQ.Where(p => p.PricePerNight <= maxPrice);

    var candidates = await candidatesQ.ToListAsync();
    if (candidates.Count == 0) return Array.Empty<PropertyDto>();   // nothing satisfies the filter

    //----------------------------------------------------------------
    // 2️⃣  Embed the *query* once
    //----------------------------------------------------------------
    var embReq = new { model = "nomic-embed-text-v1.5", input = new[] { query } };
    var embRes = await _lmClient.PostAsJsonAsync("v1/embeddings", embReq);
    embRes.EnsureSuccessStatusCode();

    using var embDoc = await embRes.Content.ReadFromJsonAsync<JsonDocument>();
    var qVec = embDoc.RootElement.GetProperty("data")[0]
                 .GetProperty("embedding")
                 .EnumerateArray().Select(e => e.GetSingle()).ToArray();

    //----------------------------------------------------------------
    // 3️⃣  Cosine-rank only inside the **filtered** candidate list
    //----------------------------------------------------------------
    var ranked = candidates
        .Select(p =>
        {
            var idx = Array.FindIndex(_properties, x => x.Id == p.Id);
            var score = idx >= 0 ? Cosine(qVec, _embeddings[idx]) : -1;
            return (prop: p, score);
        })
        .Where(x => x.score >= 0)
        .OrderByDescending(x => x.score)
        .Take(topK)
        .Select(x => x.prop)
        .ToList();

    //----------------------------------------------------------------
    // 4️⃣  Fetch one thumbnail each and project → DTO
    //----------------------------------------------------------------
    var thumbs = await db.PropertyImages
        .Where(i => ranked.Select(p => p.Id).Contains(i.PropertyId))
        .GroupBy(i => i.PropertyId)
        .Select(g => new { g.Key, Url = g.First().Url })
        .ToDictionaryAsync(x => x.Key, x => x.Url);

    var dtos = ranked.Select(p => new PropertyDto
    {
        Id            = p.Id,
        Name          = p.Name,
        Location      = p.Location,
        Description   = p.Description,
        PricePerNight = p.PricePerNight,
        Type          = p.Type,
        ProprietaireId= p.ProprietaireId,
        FirstImage    = thumbs.TryGetValue(p.Id, out var url) ? url : null,

        Wifi                  = p.Wifi,
        Kitchen               = p.Kitchen,
        Pool                  = p.Pool,
        HotTub                = p.HotTub,
        AirConditioning       = p.AirConditioning,
        Heating               = p.Heating,
        Washer                = p.Washer,
        Dryer                 = p.Dryer,
        FreeParkingOnPremises = p.FreeParkingOnPremises,
        BbqGrill              = p.BbqGrill,
        Gym                   = p.Gym,
        PetsAllowed           = p.PetsAllowed,
        SmokeAlarm            = p.SmokeAlarm,
        CarbonMonoxideAlarm   = p.CarbonMonoxideAlarm,
        FirstAidKit           = p.FirstAidKit,
        HairDryer             = p.HairDryer,
        CoffeeMaker           = p.CoffeeMaker,
        IsAvailable           = p.IsAvailable
    })
    .ToArray();

    return dtos;
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
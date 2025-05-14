// Darna/Controllers/SearchController.cs
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Darna.DTOs;
using Darna.Services;

namespace Darna.Controllers
{
    // SearchController.cs
    using Microsoft.AspNetCore.Mvc;
    using Darna.Services;

    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ListingSearchService _search;
        public SearchController(ListingSearchService search) => _search = search;

        [HttpGet]
        public async Task<IActionResult> Get(string query, int topK = 5)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("query is required");
            var (props,_) = await _search.SearchAsync(query, topK,0.15f);
            return Ok(props);
        }
    }
}
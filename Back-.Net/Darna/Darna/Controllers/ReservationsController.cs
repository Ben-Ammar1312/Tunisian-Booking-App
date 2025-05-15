using Darna.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Darna.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Ensure only authenticated users can access
    public class ReservationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reservations/mes-reservations
        [HttpGet("mes-reservations")]
        public async Task<IActionResult> GetMesReservations()
        {
            try
            {
                // Extract client ID from JWT claims
                var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (clientIdClaim == null)
                    return Unauthorized("User ID not found in token.");

                int clientId = int.Parse(clientIdClaim.Value);

                // Query reservations with related property and images
                var reservations = await _context.Reservations
                    .Where(r => r.ClientId == clientId)
                    .Include(r => r.Property)
                        .ThenInclude(p => p.Images)
                    .ToListAsync();

                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}

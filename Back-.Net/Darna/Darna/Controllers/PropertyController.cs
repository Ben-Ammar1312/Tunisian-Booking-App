using System;
using Darna.DTOs;
using Darna.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Security.Claims; // Make sure this is at the top

[ApiController]
[Route("api/[controller]")]
public class PropertyController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PropertyController> _logger;      // ← add this

    public PropertyController(
        ApplicationDbContext context,
        ILogger<PropertyController> logger)                     // ← and here
    {
        _context = context;
        _logger = logger;
    }



    [HttpGet]
    public async Task<IActionResult> GetProperties()
    {
        var properties = await _context.Properties
            .Include(p => p.Images) // Include images
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Location,
                p.Description,
                p.PricePerNight,
                p.Type,
                p.IsAvailable,
                p.ProprietaireId,
                FirstImage = p.Images != null && p.Images.Any() ? p.Images.First().Url : null
            })
            .ToListAsync();

        return Ok(properties);
    }


    [HttpPost]
    public async Task<IActionResult> AddProperty(PropertyDto dto)

    {
        // at the top of AddProperty(...)
        var dtoJson = JsonSerializer.Serialize(dto, new JsonSerializerOptions { WriteIndented = true });
        _logger.LogInformation("🏷 Incoming DTO JSON:\n{0}", dtoJson);



        var property = new Property
        {
            Name = dto.Name,
            Location = dto.Location,
            Description = dto.Description,
            PricePerNight = dto.PricePerNight,
            Type = dto.Type,
            ProprietaireId = dto.ProprietaireId,
            IsAvailable = dto.IsAvailable,
            Images = dto.Images?.Select(url => new PropertyImage { Url = url }).ToList(),

            // Map amenities
            Wifi = dto.Wifi,
            Kitchen = dto.Kitchen,
            Pool = dto.Pool,
            HotTub = dto.HotTub,
            AirConditioning = dto.AirConditioning,
            Heating = dto.Heating,
            Washer = dto.Washer,
            Dryer = dto.Dryer,
            FreeParkingOnPremises = dto.FreeParkingOnPremises,
            BbqGrill = dto.BbqGrill,
            Gym = dto.Gym,
            PetsAllowed = dto.PetsAllowed,
            SmokeAlarm = dto.SmokeAlarm,
            CarbonMonoxideAlarm = dto.CarbonMonoxideAlarm,
            FirstAidKit = dto.FirstAidKit,
            HairDryer = dto.HairDryer,
            CoffeeMaker = dto.CoffeeMaker
        };

        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            property.Id,
            property.Name,
            property.Location,
            property.Description,
            property.PricePerNight,
            property.Type,
            property.IsAvailable,
            property.Images
        });
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetProperty(int id)
    {
        var property = await _context.Properties
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (property == null)
            return NotFound();


        var propertyDto = new PropertyDto
        {
            Id = property.Id,
            Name = property.Name,
            Location = property.Location,
            Description = property.Description,
            PricePerNight = property.PricePerNight,
            Type = property.Type,
            ProprietaireId = property.ProprietaireId,
            Images = property.Images?.Select(img => img.Url).ToList(), // Map images to a list of strings (URLs)

            // Amenities
            Wifi = property.Wifi,
            Kitchen = property.Kitchen,
            Pool = property.Pool,
            HotTub = property.HotTub,
            AirConditioning = property.AirConditioning,
            Heating = property.Heating,
            Washer = property.Washer,
            Dryer = property.Dryer,
            FreeParkingOnPremises = property.FreeParkingOnPremises,
            BbqGrill = property.BbqGrill,
            Gym = property.Gym,
            PetsAllowed = property.PetsAllowed,
            SmokeAlarm = property.SmokeAlarm,
            CarbonMonoxideAlarm = property.CarbonMonoxideAlarm,
            FirstAidKit = property.FirstAidKit,
            HairDryer = property.HairDryer,
            CoffeeMaker = property.CoffeeMaker,
            IsAvailable = property.IsAvailable
        };


        // Serialize to JSON and print to console
        var json = JsonSerializer.Serialize(propertyDto, new JsonSerializerOptions { WriteIndented = true });
        Console.WriteLine(json);



        return Ok(propertyDto);
    }

    // Get properties for a specific user by their userId
    [HttpGet("mes-annonces/{userId}")]
    public async Task<IActionResult> GetMesAnnonces(int userId)
    {
        var properties = await _context.Properties
            .Where(p => p.ProprietaireId == userId) // Filter by the user ID
            .Include(p => p.Images) // Include images
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Location,
                p.Description,
                p.PricePerNight,
                p.Type,
                p.IsAvailable,
                p.ProprietaireId,
                FirstImage = p.Images != null && p.Images.Any() ? p.Images.First().Url : null
            })
            .ToListAsync();

        if (!properties.Any())
        {
            return NotFound("No properties found for this user.");
        }

        return Ok(properties);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProperty(int id)
    {
        var property = await _context.Properties
            .Include(p => p.Images) // include images to delete them too if necessary
            .FirstOrDefaultAsync(p => p.Id == id);

        if (property == null)
        {
            return NotFound();
        }

        // Remove the associated images first if they exist
        if (property.Images != null && property.Images.Any())
        {
            _context.PropertyImages.RemoveRange(property.Images);
        }

        // Remove the property
        _context.Properties.Remove(property);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 success, no body returned
    }






}

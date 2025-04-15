using System;
using Darna.DTOs;
using Darna.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PropertyController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PropertyController(ApplicationDbContext context)
    {
        _context = context;
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
        var property = new Property
        {
            Name = dto.Name,
            Location = dto.Location,
            Description = dto.Description,
            PricePerNight = dto.PricePerNight,
            Type = dto.Type,
            ProprietaireId = dto.ProprietaireId,
            Images = dto.Images?.Select(url => new PropertyImage { Url = url }).ToList()
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

        return Ok(property);
    }


}

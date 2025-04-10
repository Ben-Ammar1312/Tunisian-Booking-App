using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Darna.DTOs;
using Darna.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace Darna.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Vérifier si l'email existe déjà
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email déjà utilisé." });

            // Hacher le mot de passe
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Créer un utilisateur en fonction du rôle
            User newUser;
            switch (registerDto.Role.ToLower())
            {
                case "admin":
                    newUser = new Admin { FullName = registerDto.FullName, Email = registerDto.Email, PasswordHash = hashedPassword };
                    break;
                case "proprietaire":
                    newUser = new Proprietaire { FullName = registerDto.FullName, Email = registerDto.Email, PasswordHash = hashedPassword };
                    break;
                case "client":
                    newUser = new Client { FullName = registerDto.FullName, Email = registerDto.Email, PasswordHash = hashedPassword };
                    break;
                default:
                    return BadRequest(new { message = "Rôle invalide. Choisissez 'Admin', 'Proprietaire' ou 'Client'." });
            }

            // Ajouter l'utilisateur à la base de données
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Inscription réussie !" });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });

            // Générer un token JWT (tu devras configurer JWT plus tard)
            var token = "faketoken123"; // Remplace par un vrai token généré

            return Ok(new { token, role = user.GetType().Name, fullName = user.FullName });
        }

    }
}
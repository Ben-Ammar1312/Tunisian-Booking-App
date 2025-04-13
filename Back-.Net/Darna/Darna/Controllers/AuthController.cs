using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Darna.DTOs;
using Darna.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
                return Unauthorized(new { message = "Email or password is incorrect." });

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
                return Unauthorized(new { message = "Email or password is incorrect." });

            // 1) Create claims (you can add more user info as needed)
            var authClaims = new List<Claim>
        {
            // This represents the 'name' or unique identifier for the user
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

            // Email if you like
            new Claim(ClaimTypes.Email, user.Email),

            // Provide a JTI (unique token ID) for best practices
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            // 2) The same key you used in Program.cs
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("My32CharacterMinimumSuperSecretKey!!!"));

            // 3) Create the token
            var token = new JwtSecurityToken(
                issuer: null,    // Not validating issuer in this setup
                audience: null,  // Not validating audience
                expires: DateTime.UtcNow.AddHours(3), // Token valid for 3 hours
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            // 4) Serialize token
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Return it to the client
            return Ok(new
            {
                token = tokenString,
                role = user.GetType().Name, // Or however you store roles
                fullName = user.FullName,
                expiration = token.ValidTo
            });
        }
    }
}
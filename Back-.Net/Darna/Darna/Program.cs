using System.Text.Json.Serialization;
using Darna.Models;
using Darna.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Darna.DTOs;
using Microsoft.AspNetCore.Authorization;
var builder = WebApplication.CreateBuilder(args);

// 1) CORS — allow everything (DEV only)
builder.Services.AddCors(o =>
    o.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader()
    )
);

// 2) Controllers + JSON settings
builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
    );

// 3) JWT Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.RequireHttpsMetadata = false;
        opt.SaveToken = true;
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

// 4) EF Core
builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")!)
       .EnableSensitiveDataLogging()
       .LogTo(Console.WriteLine,
              new[] { DbLoggerCategory.Database.Command.Name },
              LogLevel.Information)
);

// 5) HTTP clients & your search service
builder.Services.AddHttpClient<ChatService>("llocal-lm", c =>
    c.BaseAddress = new Uri("http://127.0.0.1:1234/"));

// ListingSearchService pulls llocal-lm via IHttpClientFactory
//builder.Services.AddSingleton<ListingSearchService>();


Stripe.StripeConfiguration.ApiKey =
    builder.Configuration["Stripe:SecretKey"];

builder.Services.Configure<StripeSettings>(
    builder.Configuration.GetSection("Stripe"));

builder.Services.AddAuthorization(opts =>
{
    // anything *without* [AllowAnonymous] now requires a valid user
    opts.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});
var app = builder.Build();

// ────── BUILD THE INDEX RIGHT HERE ──────
// Block on startup so that by the time Kestrel is up, the index is READY.
//app.Services
//   .GetRequiredService<ListingSearchService>()
//   .BuildIndexAsync()
//   .GetAwaiter()
//   .GetResult();


app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
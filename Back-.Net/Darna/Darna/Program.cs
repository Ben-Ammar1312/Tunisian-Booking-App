using System.Text.Json.Serialization;
using Darna.Models;
using Darna.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
//builder.Services.AddHttpClient("lmstudio", c =>
//    c.BaseAddress = new Uri("http://127.0.0.1:1234/"));
//builder.Services.AddHttpClient<ChatService>(c =>
//    c.BaseAddress = new Uri("http://127.0.0.1:1234/"));
//builder.Services.AddSingleton<ListingSearchService>();

var app = builder.Build();

// ────── BUILD THE INDEX RIGHT HERE ──────
// Block on startup so that by the time Kestrel is up, the index is READY.
//app.Services
//   .GetRequiredService<ListingSearchService>()
//   .BuildIndexAsync()
//   .GetAwaiter()
//   .GetResult();

// ────── MIDDLEWARE PIPELINE ──────
//app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
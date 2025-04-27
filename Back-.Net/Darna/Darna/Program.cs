using System.Text.Json.Serialization;
using Darna.Models;
using Darna.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ——— Controllers + JSON (avoid EF cycles)
builder.Services
    .AddControllers()
    .AddJsonOptions(opts =>
        opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
    );

// ——— JWT Auth (dev only)
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

// ——— EF Core
builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")!).EnableSensitiveDataLogging()        // ← add this
      .LogTo(Console.WriteLine,
             new[] { DbLoggerCategory.Database.Command.Name },
             LogLevel.Information));

;

// ——— CORS for Angular
builder.Services.AddCors(o => o.AddPolicy("AllowAngular", p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
));

// ——— Our **named** LM Studio client
builder.Services.AddHttpClient("lmstudio", c =>
{
    c.BaseAddress = new Uri("http://10.10.217.175:3000/");
});
builder.Services.AddHttpClient<ChatService>(client =>
{
    client.BaseAddress = new Uri("http://10.10.217.175:3000/");
});
// ——— RAG service
builder.Services.AddSingleton<ListingSearchService>();

var app = builder.Build();
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Kick off your index build (fire‑and‑forget)
_ = app.Services
      .GetRequiredService<ListingSearchService>()
      .BuildIndexAsync();

app.Run();
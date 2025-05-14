namespace Darna.Controllers;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Darna.Models;
[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _cfg;
    private readonly IServiceScopeFactory _scopeFactory;

    public PaymentsController(IConfiguration cfg, IServiceScopeFactory sf) => (_cfg,_scopeFactory) = (cfg, sf);

    // POST /api/payments/create-intent
    [HttpPost("create-intent")]
    public ActionResult CreateIntent([FromBody] CreatePayDto dto)
    {
        var service = new PaymentIntentService();
        var intent = service.Create(new PaymentIntentCreateOptions
        {
            Amount   = (long)(dto.AmountTnd ),   
            Currency = "USD",
            Metadata = new Dictionary<string,string>
            {
                ["propertyId"]   = dto.PropertyId.ToString(),
                ["nights"]       = dto.Nights.ToString(),
                ["clientId"]     = dto.ClientId.ToString()
            },
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true            // lets Stripe pick card, Apple Pay, …
            }
        });

        return Ok(new
        {
            clientSecret   = intent.ClientSecret,
            publishableKey = _cfg.GetSection("Stripe")["PublishableKey"]
        });
    }
    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json   = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var secret = _cfg["Stripe:WebhookSecret"];
        Event evt;

        try {
            evt = EventUtility.ConstructEvent(json,
                Request.Headers["Stripe-Signature"],
                secret);
        } catch (Exception e) {
            return BadRequest($"❌  Webhook error: {e.Message}");
        }

        if (evt.Type == Events.PaymentIntentSucceeded)
        {
            var intent = evt.Data.Object as PaymentIntent;
            // 1️⃣  Extract metadata
            int propId   = int.Parse(intent.Metadata["propertyId"]);
            int nights   = int.Parse(intent.Metadata["nights"]);
            int clientId = int.Parse(intent.Metadata["clientId"]);

            // 2️⃣  Create Reservation in DB
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var reservation = new Reservation {
                PropertyId  = propId,
                ClientId   = clientId,
                StartDate  = DateTime.UtcNow.Date,
                EndDate    = DateTime.UtcNow.Date.AddDays(nights),
                TotalPrice = (decimal)intent.Amount / 100m
            };
            db.Reservations.Add(reservation);
            await db.SaveChangesAsync();
        }
        return Ok();
    }
}

public record CreatePayDto(int PropertyId, int ClientId,
    int Nights, decimal AmountTnd);
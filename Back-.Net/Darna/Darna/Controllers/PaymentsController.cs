// src/Controllers/PaymentsController.cs
using System.Text;                      // Encoding
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;                           // Event, EventUtility, Events, …
using Darna.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Darna.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration      _cfg;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PaymentsController> _log;

    public PaymentsController(
        IConfiguration         cfg,
        IServiceScopeFactory   scopeFactory,
        ILogger<PaymentsController> log)
    {
        _cfg          = cfg;
        _scopeFactory = scopeFactory;
        _log          = log;
    }

    // ───────────────────────────────────────────────────────────── create intent
    // POST /api/payments/create-intent
    [HttpPost("create-intent")]
    public ActionResult CreateIntent([FromBody] CreatePayDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var service = new PaymentIntentService();

        var intent = service.Create(new PaymentIntentCreateOptions
        {
            Amount   = (long)(dto.AmountTnd * 100),   // to “cents”
            Currency = "usd",
            Metadata = new()
            {
                ["propertyId"] = dto.PropertyId.ToString(),
                ["nights"]     = dto.Nights    .ToString(),
                ["clientId"]   = userId .ToString()
            },
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true
            }
        });

        return Ok(new
        {
            clientSecret   = intent.ClientSecret,
            publishableKey = _cfg["Stripe:PublishableKey"]
        });
    }

    // ───────────────────────────────────────────────────────────── webhook
    // POST /api/payments/webhook   (Stripe CLI or live dashboard will hit this)
    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        string payload    = await new StreamReader(Request.Body, Encoding.UTF8).ReadToEndAsync();
        string sigHeader  = Request.Headers["Stripe-Signature"];
        string secret     = _cfg["Stripe:WebhookSecret"];

        _log.LogInformation("▶ using webhook secret = {Secret}", secret);

        Event stripeEvent;
        try
        {
            // NB: string overload – payload is a JSON *string*
            stripeEvent = EventUtility.ConstructEvent(payload, sigHeader, secret, throwOnApiVersionMismatch: false);
        }
        catch (StripeException ex)
        {
            _log.LogWarning("⚠️  Invalid signature → {Msg}", ex.Message);
            return BadRequest();
        }

        _log.LogInformation("▶️  Stripe event {Type}", stripeEvent.Type);

        if (stripeEvent.Type == "payment_intent.succeeded")
        {
            var pi = (PaymentIntent)stripeEvent.Data.Object;

            int propertyId = int.Parse(pi.Metadata["propertyId"]);
            int nights     = int.Parse(pi.Metadata["nights"]);
            int clientId   = int.Parse(pi.Metadata["clientId"]);

            // create reservation
            await using var scope = _scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            db.Reservations.Add(new Reservation
            {
                PropertyId  = propertyId,
                ClientId    = clientId,
                StartDate   = DateTime.UtcNow.Date,
                EndDate     = DateTime.UtcNow.Date.AddDays(nights),
                TotalPrice  = (decimal)pi.Amount / 100m
            });
            await db.SaveChangesAsync();

            _log.LogInformation("✅ Reservation stored → property {Prop} / client {Cli}", propertyId, clientId);
        }

        return Ok();   // 200 so Stripe stops retrying
    }
}

// ───────────────────────────────────────────────────────────── DTO
public record CreatePayDto(
    int     PropertyId,
    int     ClientId,
    int     Nights,
    decimal AmountTnd);
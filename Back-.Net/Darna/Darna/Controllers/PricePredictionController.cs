using Darna.DTOs;
using Darna.Services;
using Microsoft.AspNetCore.Mvc;

namespace Darna.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricePredictionController : ControllerBase
    {
        private readonly PredictionService _predictionService = new();

        [HttpPost("predict")]
        public ActionResult<float> Predict([FromBody] PredictionInput input)
        {
            float logVal = _predictionService.PredictPrice(input); // log1p(rate)
            float nightlyRate = MathF.Exp(logVal) - 1;                 // back to linear
            return Ok(nightlyRate);
        }
    }
}

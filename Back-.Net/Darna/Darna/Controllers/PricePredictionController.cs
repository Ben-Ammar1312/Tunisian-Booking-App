using Darna.DTOs;
using Darna.Services;
using Microsoft.AspNetCore.Mvc;

namespace Darna.Controllers
{
    public class PricePredictionController : Controller
    {
        private readonly PredictionService _predictionService;

        public PricePredictionController()
        {
            _predictionService = new PredictionService();
        }

        [HttpPost("predict")]
        public ActionResult<float> Predict([FromBody] PredictionInput input)
        {
            var predictedRate = _predictionService.PredictPrice(input);
            return Ok(predictedRate);
        }
    }
}

namespace Darna.Services
{
    using Darna.DTOs;
    using Microsoft.ML;
    using Microsoft.ML.Data;
    using Microsoft.ML.Transforms.Onnx;

    public class PredictionService
    {
        private readonly MLContext _mlContext;
        private readonly PredictionEngine<PredictionInput, PredictionOutput> _predictionEngine;

        public PredictionService()
        {
            _mlContext = new MLContext();

            // Load ONNX model
            var onnxModelPath = Path.Combine(AppContext.BaseDirectory, "xgb_model.onnx");
            var pipeline = _mlContext.Transforms.ApplyOnnxModel(modelFile: onnxModelPath);
            var emptyData = _mlContext.Data.LoadFromEnumerable(new List<PredictionInput>());

            var model = pipeline.Fit(emptyData);

            _predictionEngine = _mlContext.Model.CreatePredictionEngine<PredictionInput, PredictionOutput>(model);
        }

        public float PredictPrice(PredictionInput input)
        {
            var prediction = _predictionEngine.Predict(input);
            return prediction.PredictedRate;
        }
    }
}
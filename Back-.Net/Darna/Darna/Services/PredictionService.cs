namespace Darna.Services
{
    using Darna.DTOs;
    using Microsoft.ML;
    using Microsoft.ML.Data;
    using Microsoft.ML.Transforms.Onnx;

    public class PredictionService
    {
        private readonly PredictionEngine<PredictionInput, PredictionOutput> _predictionEngine;

        public PredictionService()
        {
            var mlContext = new MLContext();

            var onnxModelPath = Path.Combine(AppContext.BaseDirectory, "xgb_model.onnx");

            // f0‑f22  → vector column "input"
            var inputCols = Enumerable.Range(0, 23)
                                      .Select(i => $"f{i}")
                                      .ToArray();

            var pipeline = mlContext.Transforms
                .Concatenate("input", inputCols)
                .Append(mlContext.Transforms.ApplyOnnxModel(
                    outputColumnNames: new[] { "variable" },
                    inputColumnNames: new[] { "input" },
                    modelFile: onnxModelPath));

            var emptyData = mlContext.Data.LoadFromEnumerable(new List<PredictionInput>());
            var model = pipeline.Fit(emptyData);

            _predictionEngine = mlContext.Model
                                         .CreatePredictionEngine<PredictionInput, PredictionOutput>(model);
        }

        /// <summary>
        /// Returns log1p(predictedPrice)  (same scale the model outputs)
        /// </summary>
        public float PredictPrice(PredictionInput input)
        {
            var output = _predictionEngine.Predict(input);
            return output.Values[0];   // first (only) element of the 1‑dim vector
        }
    }
}
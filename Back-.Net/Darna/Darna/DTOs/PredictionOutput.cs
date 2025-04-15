using Microsoft.ML.Data;

namespace Darna.DTOs
{
    public class PredictionOutput
    {

        [ColumnName("variable")] // Adjust according to ONNX output node name
        public float PredictedRate { get; set; }
    }
}

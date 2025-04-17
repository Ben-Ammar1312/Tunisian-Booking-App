using Microsoft.ML.Data;

namespace Darna.DTOs
{
    public class PredictionOutput
    {

        [ColumnName("variable")]
        [VectorType(1)]
        public float[] Values { get; set; } = default!;
    }
}

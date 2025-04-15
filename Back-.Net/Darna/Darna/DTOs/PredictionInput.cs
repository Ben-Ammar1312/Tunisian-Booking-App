namespace Darna.DTOs
{
    public class PredictionInput
    {
        // f0 location
        public float f0 { get; set; }
        public float f1 { get; set; }
        public float f2 { get; set; }
        // continue for all 23 features (f0 to f22)
        public float f22 { get; set; }
    }
}

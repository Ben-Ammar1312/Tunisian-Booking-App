namespace Darna.Services
{
    public class HostedIndexBuilder : IHostedService
    {
        private readonly ListingSearchService _svc;
        public HostedIndexBuilder(ListingSearchService svc) => _svc = svc;
        public async Task StartAsync(CancellationToken _)
            => await _svc.BuildIndexAsync();
        public Task StopAsync(CancellationToken _) => Task.CompletedTask;
    }
}
